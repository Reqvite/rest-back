const Ingredient = require("../models/ingredientModel");
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { AuthorizationError, NotFoundError } = require('../utils/errors/CustomErrors');

const IngredientsController = {
  getAllIngredients: async (req, res) => {
    const result = await Ingredient.find();

    if (
      result === null ||
      (Array.isArray(result) && result.length === 0)
    ) {
      const err = new NotFoundError(
        'No personnel records found for the given restaurant ID!'
      );
      return next(err);
    }

    res.status(200).json({
      code: 200,
      message: "success",
      result,
    });
  },
};

module.exports = IngredientsController;
