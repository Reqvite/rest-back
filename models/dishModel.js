const mongoose = require('mongoose');
const { dishCategories } = require('../constants/constants');

const DishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingredient',
      },
    ],
    picture: {
      type: String,
      //required: true,
    },
    type: {
      type: String,
      enum: {
        values: dishCategories,
        message: '{VALUE} is not supported',
      },
      required: true,
    },
    spicy: {
      type: Boolean,
      required: true,
    },
    vegetarian: {
      type: Boolean,
      required: true,
    },
    pescatarian: {
      type: Boolean,
      required: true,
    },
    portionWeight: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Dish = mongoose.model('Dish', DishSchema);

module.exports = Dish;
