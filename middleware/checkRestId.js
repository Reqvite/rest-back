const Restaurant = require('../models/restaurantModel');
const { NotFoundError } = require('../utils/errors/CustomErrors');

const checkRestId = async (req, res, next) => {
  const restId = req.params.restId;
  try {
    const restaurant = await Restaurant.findById(restId);
    if (!restaurant) {
      return next(new NotFoundError('Restaurant not found'));
    }
    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

module.exports = checkRestId;
