const { Restaurant } = require('../models');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError } = require('../utils/errors/CustomErrors');

const restaurantsController = {
  getRestaurantById: asyncErrorHandler(async (req, res, next) => {
      const { id } = req.params;
      const restaurant = await Restaurant.findById(id);

      if (restaurant === null || (Array.isArray(restaurant) && restaurant.length === 0)) {
        const err = new NotFoundError('No restaurant records found for the given restaurant ID!');
        return next(err);
      }

      res.status(200).json(restaurant);
  }),
};

module.exports = restaurantsController;
