const Joi = require('joi');
const { validateIdInJoiSchema } = require('../validations');

const personnelJoiSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/)
    .required(),
  gender: Joi.string().valid('Male', 'Female').required(),
  role: Joi.string().valid('waiter', 'cook', 'admin').required(),
  restaurant_id: Joi.string()
    .custom((value, helpers) => validateIdInJoiSchema(value, helpers))
    .required(),
  phone: Joi.string()
    .pattern(/^(\+?380)?\d{9}$/)
    .required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  picture: Joi.string(),
}).options({ abortEarly: false, allowUnknown: false });

const personnelJoiSchemaDelete = Joi.object({
  restaurant_id: Joi.string()
    .custom((value, helpers) => validateIdInJoiSchema(value, helpers))
    .required(),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  personnelJoiSchema,
  personnelJoiSchemaDelete,
};
