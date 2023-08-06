const Dish = require('../models/dishModel');
const Restaurant = require('../models/restaurantModel');
const Ingredient = require('../models/ingredientModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const {
  NotFoundError,
  BadRequestError,
} = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK, CREATED } = StatusCodes;

const DishController = {
  // request example GET http://localhost:3001/dishes/restaurant/64c63ab344d6a7657d7a49d5?type=Pizza&isActive=false
  getAllDishes: asyncErrorHandler(async (req, res, next) => {
    const restaurantId = req.params.id;
    const { type, isActive } = req.query;

    const matchQuery = {};

    if (type) {
      matchQuery.type = type;
    }

    if (isActive !== undefined) {
      matchQuery.isActive = isActive;
    }

    const dish = await Restaurant.findById(restaurantId).populate({
      path: 'dishes_ids',
      select: 'name picture portionWeight price ingredients isActive',
      match: matchQuery,
      populate: {
        path: 'ingredients',
        model: Ingredient,
        select: 'name',
      },
    });

    if (!dish) {
      const err = new BadRequestError();
      return next(err);
    }

    res.status(OK).json(dish.dishes_ids);
}),

  getDishesById: asyncErrorHandler(async (req, res) => {
    const dishId = req.params.id;

    const dish = await Dish.findById(dishId).populate({ path: 'ingredients', model: 'Ingredient' });

    if (!dish) {
      const err = new NotFoundError('Dish not found for the given dish ID!');
      return next(err);
    }

    res.status(OK).json(dish);
  }),

  addDish: asyncErrorHandler(async (req, res, next) => {
    const restaurantId = req.params.id;
    // console.log(req.body)

    const newDish = new Dish({
      name: req.body.name,
      ingredients: req.body.ingredients,
      picture: req.body.picture,
      type: req.body.type,
      spicy: req.body.spicy,
      vegetarian: req.body.vegetarian,
      pescatarian: req.body.pescatarian,
      portionWeight: req.body.portionWeight,
      price: req.body.price,
      isActive:req.body.isActive,
    });

    console.log(newDish)

    if (!newDish) {
      const err = new BadRequestError('Unable to add dish to database');
      return next(err);
    }

    const savedDish = await newDish.save();

    const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
      $push: { dishes_ids: savedDish._id },
    });

    if (!restaurant) {
      const err = new BadRequestError(
        'Unable to add dish to restaurant dishes_ids. Check if the dish was added to Dish collection'
      );
      return next(err);
    }

    res.status(CREATED).json(newDish);
  }),

  editDishById: asyncErrorHandler(async (req, res, next) => {
    const dishId = req.params.id;

    const dish = await Dish.findByIdAndUpdate(dishId, {
      name: req.body.name,
      ingredients: req.body.ingredients,
      picture: req.body.picture,
      type: req.body.type,
      spicy: req.body.spicy,
      vegetarian: req.body.vegetarian,
      pescatarian: req.body.pescatarian,
      portionWeight: req.body.portionWeight,
      price: req.body.price,
      isActive:req.body.isActive,
    });

    if (!dish) {
      const err = new NotFoundError('Dish not found for the given dish ID!');
      return next(err);
    }

    res.status(OK).json({ message: 'Dish edited successfully' });
  }),

  disableDishById: asyncErrorHandler(async (req, res, next) => {
    const dishId = req.params.id;
    const restaurantId = req.params.rest_id;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      const err = new NotFoundError('No restaurant records found for the given restaurant ID!');
      return next(err);
    }

    const dish = await Dish.findById(dishId);

    if (!dish) {
      const err = new NotFoundError('Dish not found for the given dish ID!');
      return next(err);
    }

    dish.isActive = false;
    await dish.save();

    res.status(OK).json({ message: 'Dish deleted successfully' });
  }),
};

module.exports = DishController;
