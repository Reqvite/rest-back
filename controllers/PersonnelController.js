const bcrypt = require("bcrypt");
const s3 = require("@aws-sdk/client-s3");
const presigner = require("@aws-sdk/s3-request-presigner");
const {AuthorizationError, NotFoundError} = require('../utils/errors/CustomErrors');
const Personnel = require('../models/personnelModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');

const s3Client = new s3.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const personnelController = {
    getPersonnelByRestaurantId: asyncErrorHandler(async (req, res, next) => {
        const personnel = await Personnel.find({restaurant_id: req.params.id});

        if (personnel === null || (Array.isArray(personnel) && personnel.length === 0)) {
            const err = new NotFoundError('No personnel records found for the given restaurant ID!');
            return next(err);
        }

        /*for (const person of personnel) {
            if (!person.picture) {
                person.picture = "RESTio.png"
            }
            const getObjectParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: person.picture,
            }
            const command = new s3.GetObjectCommand(getObjectParams);
            person.picture = await presigner.getSignedUrl(s3Client, command, {expiresIn: 3600});
        }*/

        res.status(200).json(personnel);
    }),

    getPersonnelById: asyncErrorHandler(async (req, res) => {
        const personnel = await Personnel.findById(req.params.id);
        console.log(personnel);

        if ((Array.isArray(personnel) && personnel.length === 0)) {
            const err = new NotFoundError('Personnel with that ID is not found!');
            return next(err);
        }

       /* if (!personnel.picture) {
            personnel.picture = "RESTio.png"
        }
        const getObjectParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: personnel.picture,
        }
        const command = new s3.GetObjectCommand(getObjectParams);
        personnel.picture = await presigner.getSignedUrl(s3Client, command, {expiresIn: 3600});*/

        personnel.password = "";

        res.status(200).json(personnel);
    }),

    addPersonnel: asyncErrorHandler(async (req, res) => {
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

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 13);

        // Create the personnel object to save to the database
        const newPersonnel = new Personnel({
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
    }),

    updatePersonnel: asyncErrorHandler(async (req, res, next) => {
        const {firstName, lastName, gender, password, phone, role, email, address, picture, restaurant_id} =
            req.body;
        const personnelId = req.params.id;

        // Find the personnel by ID
        const personnel = await Personnel.findById(personnelId);

        if (personnel === null || (Array.isArray(personnel) && personnel.length === 0)) {
            const err = new NotFoundError('Personnel with that ID is not found!');
            return next(err);
        }

        //Take a restaurant id from the request body and check if it matches the rest id of the personnel
        if (personnel.restaurant_id.toString() !== restaurant_id) {
            console.log(personnel.restaurant_id.toString());
            console.log(restaurant_id);
            const err = new AuthorizationError();
            return next(err);
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 13);

        // Update the personnel data
        personnel.name = `${firstName} ${lastName}`;
        personnel.gender = gender;
        personnel.phone = phone;
        personnel.role = role;
        personnel.password = hashedPassword;
        personnel.email = email;
        personnel.address = address;
        personnel.picture = picture;

        // Save the updated personnel data to the database
        const updatedPersonnel = await personnel.save();

        res.status(200).json(updatedPersonnel);
    }),

    deletePersonnel: asyncErrorHandler(async (req, res, next) => {
        const personnelId = req.params.id;

        // Find the personnel by ID
        const personnel = await Personnel.findById(personnelId);

        if (personnel === null || (Array.isArray(personnel) && personnel.length === 0)) {
            const err = new NotFoundError('Personnel with that ID is not found!');
            return next(err);
        }

        //Take a restaurant id from the request body and check if it matches the rest id of the personnel
        if (personnel.restaurant_id.toString() !== req.body.restaurant_id) {
            console.log(personnel.restaurant_id.toString());
            console.log(req.body.restaurant_id);
            const err = new AuthorizationError();
            return next(err);
        }

        // Delete the personnel from the database
        await personnel.deleteOne();

        res.status(200).json({message: 'Personnel deleted successfully'});
    }),
};

module.exports = personnelController;
