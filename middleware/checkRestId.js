const Restaurant = require('../models/restaurantModel');
const { NotFoundError } = require('../utils/errors/CustomErrors');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');

const checkRestId = asyncErrorHandler(async (req, res, next) => {
  const restId = req.params.restId;

  const restaurant = await Restaurant.findById(restId);
  if (!restaurant) {
    return next(new NotFoundError('Restaurant not found'));
  }
  next();
});

module.exports = checkRestId;
