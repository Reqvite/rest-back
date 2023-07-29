const Restaurant = require("../models/restaurantModel");

const checkRestId = async (req, res, next) => {
  const restId = req.params.restId;
  try {
    const restaurant = await Restaurant.findById(restId);
    if (!restaurant) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Restaurant not found",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal Server Error",
    });
  }
};

module.exports = checkRestId;
