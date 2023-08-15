const Restaurant = require('../models/restaurantModel');
const { NotFoundError } = require('../utils/errors/CustomErrors');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');

const checkRestId = asyncErrorHandler(async (req, res, next) => {
  const { rest_id } = req.params;

  const restaurant = await Restaurant.findById(rest_id);
  if (!restaurant) {
    return next(new NotFoundError('Restaurant not found'));
  }
  next();
});

module.exports = checkRestId;
