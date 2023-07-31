const DB = require("../models/personnelModel");
const bcrypt = require("bcrypt");


const personnelController = {
    getPersonnelByRestaurantId: async (req, res) => {
        try {
            const personnel = await DB.Personnel.find({restaurant_id: req.params.id});
            res.status(200).json(personnel);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    getPersonnelById: async (req, res) => {
        try {

            if (!req.params.id) return res.status(400).json({message: "Missing personnel id"});

            const personnel = await DB.Personnel.findById(req.params.id);

            if(!personnel) return res.status(404).json({message: "Personnel not found"});

            personnel.password = "Type New Password Here";

            console.log(personnel);

            res.status(200).json(personnel);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    addPersonnel: async (req, res) => {
        try {
            const {
                firstName,
                lastName,
                password,
                gender,
                role,
                restaurant_id,
                phone,
                email,
                address,
                picture,
            } = req.body;

            // Check if the required fields are provided
            if (!firstName || !lastName || !password || !gender || !role || !restaurant_id || !phone || !email || !address) {
                return res.status(400).json({message: "Missing required fields"});
            }

            // Validate the password using the regex pattern
            if (
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/.test(password)
            ) {
                return res.status(400).json({
                    message:
                        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and be between 8 and 30 characters long.",
                });
            }

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 13);

            // Create the personnel object to save to the database
            const newPersonnel = new DB.Personnel({
                name: `${firstName} ${lastName}`,
                password: hashedPassword,
                restaurant_id,
                gender,
                role,
                phone,
                email,
                address,
                picture,
            });

            console.log(newPersonnel);
            // Save the personnel data to the database
            const savedPersonnel = await newPersonnel.save();

            res.status(201).json(savedPersonnel);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updatePersonnel: async (req, res) => {
        try {
            const { firstName, lastName, gender, phone, role, email, address, picture, restaurant_id } = req.body;
            const personnelId = req.params.id;

            // Check if the required fields are provided
            if (!firstName || !lastName || !gender || !role || !phone || !email || !address || !restaurant_id) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            // Find the personnel by ID
            const personnel = await DB.Personnel.findById(personnelId);

            if (!personnel) {
                return res.status(404).json({ message: "Personnel not found" });
            }

            //Take a restaurant id from the request body and check if it matches the rest id of the personnel
            if(personnel.restaurant_id.toString() !== req.body.restaurant_id) {

                console.log(personnel.restaurant_id.toString());
                console.log(req.body.restaurant_id);
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Update the personnel data
            personnel.name = `${firstName} ${lastName}`;
            personnel.gender = gender;
            personnel.phone = phone;
            personnel.role = role;
            personnel.email = email;
            personnel.address = address;
            personnel.picture = picture;

            // Save the updated personnel data to the database
            const updatedPersonnel = await personnel.save();

            res.status(200).json(updatedPersonnel);
        } catch (err) {
            res.status(500).json(err);
        }
    },


    deletePersonnel: async (req, res) => {
        try {
            const personnelId = req.params.id;

            if(!personnelId) {
                return res.status(400).json({ message: "Missing personnel ID" });
            }

            if(!req.body.restaurant_id) {
                return res.status(400).json({ message: "Missing restaurant ID" });
            }

            // Find the personnel by ID
            const personnel = await DB.Personnel.findById(personnelId);

            if (!personnel) {
                return res.status(404).json({ message: "Personnel not found" });
            }

            //Take a restaurant id from the request body and check if it matches the rest id of the personnel
            if(personnel.restaurant_id.toString() !== req.body.restaurant_id) {

                console.log(personnel.restaurant_id.toString());
                console.log(req.body.restaurant_id);
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Delete the personnel from the database
            await personnel.deleteOne();

            res.status(200).json({ message: "Personnel deleted successfully" });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

module.exports = personnelController;
