const bcrypt = require('bcrypt');
const s3 = require('@aws-sdk/client-s3');
const presigner = require('@aws-sdk/s3-request-presigner');
const {AuthorizationError, NotFoundError, BadRequestError} = require('../utils/errors/CustomErrors');
const Personnel = require('../models/personnelModel');
const Restaurant = require('../models/restaurantModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const {StatusCodes, NOT_FOUND} = require('http-status-codes');
const {OK, CREATED} = StatusCodes;

const s3Client = new s3.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const personnelController = {
    getPersonnelByRestaurantId: asyncErrorHandler(async (req, res, next) => {
        const personnel = await Personnel.find({restaurant_id: req.params.id});

        /*for (const person of personnel) {
          if (!person.picture) {
            person.picture = 'RESTio.png';
          }
          const getObjectParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: person.picture,
          };
          const command = new s3.GetObjectCommand(getObjectParams);
          person.picture = await presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }*/

        if (!personnel) {
            const err = new BadRequestError('Bad request');
            return next(err);
        }

        res.status(OK).json(personnel);
    }),

    getPersonnelById: asyncErrorHandler(async (req, res) => {
        const personnel = await Personnel.findById(req.params.id);
        console.log(personnel);

        /*if (!personnel.picture) {
          personnel.picture = 'RESTio.png';
        }
        const getObjectParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: personnel.picture,
        };
        const command = new s3.GetObjectCommand(getObjectParams);
        personnel.picture = await presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
    */
        if (!personnel) {
            const err = new NotFoundError('Personnel with that ID is not found!');
            return next(err);
        }

        res.status(OK).json(personnel);
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

        const restaurant = await Restaurant.findById(restaurant_id);

        if (!restaurant) {
            const err = new NotFoundError('Restaurant with that ID is not found!');
            return next(err);
        }

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

        res.status(CREATED).json({message: 'Personnel added successfully!'});
    }),

    updatePersonnel: asyncErrorHandler(async (req, res, next) => {
        const {firstName, lastName, gender, password, phone, role, email, address, picture, restaurant_id} =
            req.body;
        const personnelId = req.params.id;

        // Find the personnel by ID
        const personnel = await Personnel.findById(personnelId);

        if (!personnel) {
            const err = new NotFoundError('Personnel with that ID is not found!');
            return next(err);
        }

        const restaurant = await Restaurant.findById(restaurant_id);

        if (!restaurant) {
            const err = new NotFoundError('Restaurant with that ID is not found!');
            return next(err);
        }

        //Take a restaurant id from the request body and check if it matches the rest id of the personnel
        if (personnel.restaurant_id.toString() !== restaurant_id) {
            console.log(personnel.restaurant_id.toString());
            console.log(restaurant_id);
            const err = new AuthorizationError();
            return next(err);
        }

        // Update the personnel data
        personnel.name = `${firstName} ${lastName}`;
        personnel.gender = gender;
        personnel.phone = phone;
        personnel.role = role;
        personnel.email = email;
        personnel.address = address;
        if (picture) {
            personnel.picture = picture;
        }
        if (password) {
            personnel.password = await bcrypt.hash(password, 13);
        }

        // Save the updated personnel data to the database
        const updatedPersonnel = await personnel.save();

        res.status(OK).json({message: 'Personnel updated successfully!'});
    }),

    deletePersonnel: asyncErrorHandler(async (req, res, next) => {
        const personnelId = req.params.id;
        const restaurant_id = req.body.restaurant_id;
        // Find the personnel by ID
        const personnel = await Personnel.findById(personnelId);

        if (!personnel) {
            const err = new NotFoundError('Personnel with that ID is not found!');
            return next(err);
        }

        const restaurant = await Restaurant.findById(restaurant_id);

        if (!restaurant) {
            const err = new NotFoundError('Restaurant with that ID is not found!');
            return next(err);
        }

        //Take a restaurant id from the request body and check if it matches the rest id of the personnel
        if (personnel.restaurant_id.toString() !== restaurant_id) {
            console.log(personnel.restaurant_id.toString());
            console.log(restaurant_id);
            const err = new AuthorizationError();
            return next(err);
        }

        // Delete the personnel from the database
        await personnel.deleteOne();

        res.status(OK).json({message: 'Personnel deleted successfully'});
    }),
};

module.exports = personnelController;
