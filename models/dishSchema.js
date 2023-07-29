const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingridients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
  picture: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Dish = mongoose.model("Dish", DishSchema);

module.exports = Dish;
