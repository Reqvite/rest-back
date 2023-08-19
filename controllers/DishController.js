const s3 = require('@aws-sdk/client-s3');
const presigner = require('@aws-sdk/s3-request-presigner');
const Dish = require('../models/dishModel');
const Restaurant = require('../models/restaurantModel');
const Ingredient = require('../models/ingredientModel');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { NotFoundError, BadRequestError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK, CREATED } = StatusCodes;

const s3Client = new s3.S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getSignedImageURL = async (imageName) => {
  const getObjectParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName,
  };
  const command = new s3.GetObjectCommand(getObjectParams);
  return await presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

const DishController = {
  // request example
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

    if (page && limit) {
      let filteredDishes;
      if (searchText) {
        let searchTextLower = searchText.toLowerCase();
        filteredDishes = dish.dishes_ids.filter((d) => {
          let dishNameLower = d.name.toLowerCase();
          return dishNameLower.includes(searchTextLower);
        });
      } else {
        filteredDishes = dish.dishes_ids;
      }

      let paginatedDishes = filteredDishes.slice(skip, skip + limit);
      const totalPages = Math.ceil(filteredDishes.length / limit);
      console.log(totalPages);

      for (const dish of paginatedDishes) {
        if (!dish.picture) {
          dish.picture = 'RESTio.png';
        }
        dish.picture = await getSignedImageURL(dish.picture);
      }

      let response = {
        dishes: paginatedDishes,
        totalPages,
        page,
      };

      res.status(OK).json(response);
    } else {
      let data = dish.dishes_ids;
      for (const dish of data) {
        if (!dish.picture) {
          dish.picture = 'RESTio.png';
        }
        dish.picture = await getSignedImageURL(dish.picture);
      }
      res.status(OK).json(data);
    }
  }),

  getDishesById: asyncErrorHandler(async (req, res, next) => {
    const dishId = req.params.id;

    const dish = await Dish.findById(dishId).populate({ path: 'ingredients', model: 'Ingredient' });

    if (!dish.picture) {
      dish.picture = 'RESTio.png';
    }
    dish.picture = await getSignedImageURL(dish.picture);

    if (!dish) {
      const err = new NotFoundError('Dish not found for the given dish ID!');
      return next(err);
    }

    res.status(OK).json(dish);
  }),

  addDish: asyncErrorHandler(async (req, res, next) => {
    const restaurantId = req.params.rest_id;
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
      isActive: req.body.isActive,
    });

    console.log(newDish);

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
      isActive: req.body.isActive,
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
      const err = new NotFoundError('No dish records found for the given dish ID!');
      return next(err);
    }

    const updatedIsActive = !dish.isActive;

    await Dish.findByIdAndUpdate(dishId, { $set: { isActive: updatedIsActive } });

    res.status(OK).json({ message: 'Dish status updated successfully' });
  }),
};

module.exports = DishController;
