const Ingredient = require('../models/ingredientModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { BadRequestError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK } = StatusCodes;

const IngredientsController = {
  getAllIngredients: asyncErrorHandler(async (_, res, next) => {
    const result = await Ingredient.find();

    if (!result) {
      const err = new BadRequestError();
      return next(err);
    }

    res.status(OK).json(result);
  }),
};

module.exports = IngredientsController;
