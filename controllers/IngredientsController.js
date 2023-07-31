const Ingredient = require('../models/ingredientModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { AuthorizationError, NotFoundError } = require('../utils/errors/CustomErrors');

const IngredientsController = {
  getAllIngredients: async (req, res) => {
    const result = await Ingredient.find();

    if (result === null || (Array.isArray(result) && result.length === 0)) {
      const err = new NotFoundError('No ingredients in database');
      return next(err);
    }

    res.status(200).json(result);
  },
};

module.exports = IngredientsController;
