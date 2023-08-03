const Joi = require('joi');

const loginJoiSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/)
    .required(),
  email: Joi.string().email().required(),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  loginJoiSchema,
};
