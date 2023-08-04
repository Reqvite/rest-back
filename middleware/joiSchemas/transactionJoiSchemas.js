const Joi = require('joi');

const createTransactionSchema = Joi.object({
  amount: Joi.number().positive().greater(0).required(),
  type: Joi.string().valid('online').required(),
  info: Joi.string().required(),
  frontLink: Joi.string().uri().required(),
}).options({ abortEarly: false, allowUnknown: false });

const callbackTransactionSchema = Joi.object({
  data: Joi.string().required(),
  signature: Joi.string().required(),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = { createTransactionSchema, callbackTransactionSchema };
