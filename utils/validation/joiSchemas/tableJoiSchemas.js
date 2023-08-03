const Joi = require('joi');
const { validateIdInJoiSchema } = require('../additionalValidation');

const updateTableJoiSchema = Joi.object({
  status: Joi.string().valid('Free', 'Taken', 'Waiting', 'Requested').required(),
  restaurant_id: Joi.string()
    .custom((value, helpers) => validateIdInJoiSchema(value, helpers))
    .required(),
}).options({ abortEarly: false, allowUnknown: false });

module.exports = {
  updateTableJoiSchema,
};
