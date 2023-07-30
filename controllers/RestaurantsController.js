const { Restaurant } = require("../models")

const restaurantsController = {
  getRestaurantById: async (req, res) => {
    try {
      const { id } = req.params;

      const restaurant = await Restaurant.findById(id);
      console.log(restaurant)

      res.status(200).json(restaurant);
    } catch (error) {
      res.status(404).json({ error });
    }
  }
};

module.exports = restaurantsController;
