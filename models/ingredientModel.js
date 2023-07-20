const { Schema, model } = require("mongoose");

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      match: /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
      minlength: 3,
      maxlength: 50
    },
    warehouseQuantity: {
      type: Number,
      required: true
    },
    type: {
      type: String,
    }
  });

const Ingredient = model("ingredient", ingredientSchema);

module.exports = Ingredient;