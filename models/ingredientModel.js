const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSchemaValidationErrors } = require("../helpers");

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    warehouseQuantity: {
      type: Number,
      required: true
    },
    type: {
      type: String,
    }
  });


const joiSchema = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/).min(3).max(50).required(),
  warehouseQuantity: Joi.number().required(),
  type: Joi.string().min(3).max(100),
});

ingredientSchema.post("save", handleSchemaValidationErrors);

const schema = {
  joiSchema,
};

const Ingredient = model("ingredient", ingredientSchema);

module.exports = {Ingredient, schema};