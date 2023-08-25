const Dish = require('../models/dishModel');
const Restaurant = require('../models/restaurantModel');
const mongoose = require('mongoose');
const Ingredient = require('../models/ingredientModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError, BadRequestError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK, CREATED } = StatusCodes;
const { getSignedUrl } = require('../utils/s3');

const DishController = {
  // GET http://localhost:3001/dishes/restaurant/64c9f7904626278155af5599/?page=1&limit=11&isActive=true&type=Salads&searchText=Oli

  getAllDishes: asyncErrorHandler(async (req, res, next) => {
    const restaurantId = req.params.rest_id;
    const { type, isActive } = req.query;
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const searchText = req.query.searchText || '';
    const skip = (page - 1) * limit;

    const matchQuery = {};

    if (type) {
      matchQuery.type = type;
    }

    if (isActive !== undefined) {
      matchQuery.isActive = isActive;
    }

    const dish = await Restaurant.findById(restaurantId).populate({
      path: 'dishes_ids',
      select: 'name picture portionWeight price ingredients type isActive vegetarian',
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

    let sortedDishes = dish.dishes_ids.sort((a, b) => {
      if (a.isActive && !b.isActive) {
        return -1;
      }
      if (!a.isActive && b.isActive) {
        return 1;
      }
      return 0;
    });

    if (page && limit) {
      let filteredDishes;
      if (searchText) {
        let searchTextLower = searchText.toLowerCase();
        filteredDishes = sortedDishes.filter((d) => {
          let dishNameLower = d.name.toLowerCase();
          return dishNameLower.includes(searchTextLower);
        });
      } else {
        filteredDishes = sortedDishes;
      }

      let paginatedDishes = filteredDishes.slice(skip, skip + limit);
      const totalPages = Math.ceil(filteredDishes.length / limit);

      for (const dish of paginatedDishes) {
        dish.picture = await getSignedUrl(dish);
      }

      let response = {
        dishes: paginatedDishes,
        totalPages,
        page,
      };

      res.status(OK).json(response);
    } else {
      let data = sortedDishes;
      for (const dish of data) {
        dish.picture = await getSignedUrl(dish);
      }
      res.status(OK).json(data);
    }
  }),

  getDishesById: asyncErrorHandler(async (req, res, next) => {
    const dishId = req.params.id;

    const dish = await Dish.findById(dishId).populate({ path: 'ingredients', model: 'Ingredient' });

    dish.picture = await getSignedUrl(dish);

    if (!dish) {
      const err = new NotFoundError('Dish not found for the given dish ID!');
      return next(err);
    }

    res.status(OK).json(dish);
  }),

  addDish: asyncErrorHandler(async (req, res, next) => {
    const restaurantId = req.params.rest_id;

    const session = await mongoose.startSession();
    session.startTransaction();

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
      isActive: req.body.isActive,
    });

    if (!newDish) {
      const err = new BadRequestError('Unable to add dish to the database');
      return next(err);
    }

    await newDish.save({ session });

    const restUpdation = await Restaurant.updateOne(
      { _id: restaurantId },
      { $push: { dishes_ids: newDish._id } },
      { session }
    );

    if (restUpdation.modifiedCount > 0) {
      await session.commitTransaction();
      session.endSession();
      res.status(CREATED).json(newDish);
    } else if (restUpdation.modifiedCount === 0) {
      await session.abortTransaction();
      const err = new BadRequestError('No restaurant records found for the given restaurant ID!');
      return next(err);
    }
  }),

  editDishById: asyncErrorHandler(async (req, res, next) => {
    const dishId = req.params.id;

    const dish = await Dish.updateOne(
      { _id: dishId },
      {
        name: req.body.name,
        ingredients: req.body.ingredients,
        picture: req.body.picture,
        type: req.body.type,
        spicy: req.body.spicy,
        vegetarian: req.body.vegetarian,
        pescatarian: req.body.pescatarian,
        portionWeight: req.body.portionWeight,
        price: req.body.price,
        isActive: req.body.isActive,
      }
    );

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
      const err = new NotFoundError('No dish records found for the given dish ID!');
      return next(err);
    }

    const updatedIsActive = !dish.isActive;

    await Dish.updateOne({ _id: dishId }, { $set: { isActive: updatedIsActive } });

    res.status(OK).json({ message: 'Dish status updated successfully' });
  }),
};

module.exports = DishController;
