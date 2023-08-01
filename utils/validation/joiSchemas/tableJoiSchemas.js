const Joi = require('joi');

const updateTableJoiSchema = Joi.object({
  status: Joi.string().valid('Free', 'Taken', 'Waiting', 'Requested').required(),
  restaurant_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  updateTableJoiSchema,
};
