const Ingredient = require('../models/ingredientModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError } = require('../utils/errors/CustomErrors');

const IngredientsController = {
  getAllIngredients: asyncErrorHandler(async (_, res, next) => {
    const result = await Ingredient.find();

    if (result === null || (Array.isArray(result) && result.length === 0)) {
      const err = new NotFoundError('No ingredients found in database');
      return next(err);
    }

    res.status(200).json(result);
  }),
};

module.exports = IngredientsController;
