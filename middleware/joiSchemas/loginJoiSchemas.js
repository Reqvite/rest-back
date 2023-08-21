const Joi = require('joi');
const { CHECK_PASSWORD_SCHEMA } = require('../../constants/constants');

const loginJoiSchema = Joi.object({
  password: Joi.string().min(8).max(30).pattern(CHECK_PASSWORD_SCHEMA).required(),
  email: Joi.string().email().required(),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  loginJoiSchema,
};
