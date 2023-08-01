const { Schema, model } = require("mongoose");

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name of ingredient is required"],
    match: /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/,
    minlength: 3,
    maxlength: 50,
  },
  type: {
    type: String,
  },
});

const Ingredient = model("Ingredient", ingredientSchema);

module.exports = Ingredient;
