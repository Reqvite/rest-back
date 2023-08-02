const Joi = require('joi');
const { validateIdInJoiSchema } = require('../additionalValidation');
const { dishCategories } = require('../../../constants/constants');

const dishJoiSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  ingredients: Joi.array().items(
    Joi.string().custom((value, helpers) => validateIdInJoiSchema(value, helpers))
  ),
  picture: Joi.string().required(),
  type: Joi.string().valid(...dishCategories).required(),
  spicy: Joi.boolean().required(),
  vegetarian: Joi.boolean().required(),
  pescatarian: Joi.boolean().required(),
  portionWeight: Joi.number().required(),
  price: Joi.number().required()
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  dishJoiSchema,
};

