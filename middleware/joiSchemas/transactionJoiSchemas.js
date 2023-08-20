const Joi = require('joi');
const { validateIdInJoiSchema } = require('../validations');

const createOnlineTransactionSchema = Joi.object({
  rest_id: Joi.string()
    .custom((value, helpers) => validateIdInJoiSchema(value, helpers))
    .required(),
  amount: Joi.number().positive().greater(0).required(),
  info: Joi.string().required(),
  frontLink: Joi.string().uri().required(),
}).options({ abortEarly: false, allowUnknown: false });

const createOfflineTransactionSchema = Joi.object({
  amount: Joi.number().positive().greater(0).required(),
  type: Joi.string().valid('POS', 'cash').required(),
  info: Joi.array().required(),
}).options({ abortEarly: false, allowUnknown: false });

const callbackTransactionSchema = Joi.object({
  data: Joi.string().required(),
  signature: Joi.string().required(),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  createOnlineTransactionSchema,
  callbackTransactionSchema,
  createOfflineTransactionSchema,
};
