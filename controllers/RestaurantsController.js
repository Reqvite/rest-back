const { Restaurant } = require('../models');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK } = StatusCodes;

const restaurantsController = {
  getRestaurantById: asyncErrorHandler(async (req, res, next) => {
    const { rest_id } = req.params;
    const restaurant = await Restaurant.findById(rest_id);

    if (!restaurant) {
      const err = new NotFoundError('No restaurant records found for the given restaurant ID!');
      return next(err);
    }

    res.status(OK).json(restaurant);
  }),
};

module.exports = restaurantsController;
