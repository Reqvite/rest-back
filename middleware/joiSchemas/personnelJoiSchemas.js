const Joi = require('joi');
const { validateIdInJoiSchema } = require('../validations');
const { CHECK_PASSWORD_SCHEMA } = require('../../constants/constants');

const personnelJoiSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  password: Joi.string().min(8).pattern(CHECK_PASSWORD_SCHEMA).required(),
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
  picture: Joi.string().optional().allow(''),
}).options({ abortEarly: false, allowUnknown: false });

const personnelJoiSchemaPatch = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  password: Joi.string().pattern(CHECK_PASSWORD_SCHEMA).optional().allow(''),
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
  picture: Joi.string().optional().allow(''),
}).options({ abortEarly: false, allowUnknown: false });

const personnelJoiSchemaDelete = Joi.object({
  restaurant_id: Joi.string()
    .custom((value, helpers) => validateIdInJoiSchema(value, helpers))
    .required(),
}).options({ abortEarly: false, allowUnknown: false });

const personnelRequestJoiSchema = Joi.object({
  page: Joi.string().regex(/^\d+$/).min(1),
  limit: Joi.string().regex(/^\d+$/).min(1),
  searchText: Joi.string().allow(''),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  personnelJoiSchema,
  personnelJoiSchemaDelete,
  personnelJoiSchemaPatch,
  personnelRequestJoiSchema,
};
