const bcrypt = require('bcrypt');
const { NotFoundError, BadRequestError } = require('../utils/errors/CustomErrors');
const Personnel = require('../models/personnelModel');
const Restaurant = require('../models/restaurantModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { StatusCodes } = require('http-status-codes');
const { OK, CREATED } = StatusCodes;
const { deleteFromS3, getSignedUrl } = require('../utils/s3');

const personnelController = {
  getPersonnelByRestaurantId: asyncErrorHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Get the page number from query parameter, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the limit from query parameter, default to 10
    const searchText = req.query.searchText || ''; // Get the search text from query parameter, default to empty string
    const { rest_id } = req.params;
    const skip = (page - 1) * limit;

    let totalPersonnel;

    if (!searchText) {
      totalPersonnel = await Personnel.countDocuments({ restaurant_id: rest_id });
    } else {
      totalPersonnel = await Personnel.countDocuments({
        restaurant_id: rest_id,
        name: { $regex: searchText, $options: 'i' },
      });
    }

    const totalPages = Math.ceil(totalPersonnel / limit); // Calculate total pages

    let personnel;

    if (!searchText) {
      personnel = await Personnel.find({ restaurant_id: rest_id }).skip(skip).limit(limit);
    } else {
      personnel = await Personnel.find({
        restaurant_id: rest_id,
        name: { $regex: searchText, $options: 'i' },
      })
        .skip(skip)
        .limit(limit);
    }

    if (!personnel) {
      const err = new BadRequestError('Bad request');
      return next(err);
    }

    // Get the signed url for the personnel's picture
    for (const person of personnel) {
      person.picture = await getSignedUrl(person);
    }

    res.status(OK).json({ personnel, totalPages, page }); // Send paginated data and total pages
  }),

  getPersonnelById: asyncErrorHandler(async (req, res, next) => {
    const personnel = await Personnel.findById(req.params.id);

    if (!personnel) {
      const err = new NotFoundError('Personnel with that ID is not found!');
      return next(err);
    }

    // Get the signed url for the personnel's picture
    personnel.picture = await getSignedUrl(personnel);

    res.status(OK).json(personnel);
  }),

  addPersonnel: asyncErrorHandler(async (req, res, next) => {
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

    // Save the personnel data to the database
    await newPersonnel.save();

    res.status(CREATED).json({ message: 'Personnel added successfully!' });
  }),

  updatePersonnel: asyncErrorHandler(async (req, res, next) => {
    const {
      firstName,
      lastName,
      gender,
      password,
      phone,
      role,
      email,
      address,
      picture,
      restaurant_id,
    } = req.body;
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

    // Update the personnel data
    personnel.name = `${firstName} ${lastName}`;
    personnel.gender = gender;
    personnel.phone = phone;
    personnel.role = role;
    personnel.email = email;
    personnel.address = address;
    if (picture) {
      if (
        personnel.picture !== picture &&
        personnel.picture !== 'RESTio.png' &&
        personnel.picture !== ''
      ) {
        await deleteFromS3(personnel.picture);
      }
      personnel.picture = picture;
    }
    if (password) {
      personnel.password = await bcrypt.hash(password, 13);
    }

    // Save the updated personnel data to the database
    await personnel.save();

    res.status(OK).json({ message: 'Personnel updated successfully!' });
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

    if (personnel.picture && personnel.picture !== 'RESTio.png' && personnel.picture !== '') {
      await deleteFromS3(personnel.picture);
    }

    // Delete the personnel from the database
    await personnel.deleteOne();

    res.status(OK).json({ message: 'Personnel deleted successfully' });
  }),
};

module.exports = personnelController;
