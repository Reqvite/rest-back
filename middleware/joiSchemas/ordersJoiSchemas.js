const Joi = require('joi');
const { validateIdInJoiSchema } = require('../validations');

const orderItemSchema = Joi.object({
  dish: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  quantity: Joi.number().integer().min(1).required(),
  status: Joi.string().valid('Ordered', 'In progress', 'Ready', 'Served').optional(),
  comment: Joi.string().optional(),
});

const createOrderJoiSchema = Joi.object({
  status: Joi.string().valid('Open', 'Paid', 'Canceled', 'Closed').optional(),
  table_id: Joi.string()
    .custom((value, helpers) => validateIdInJoiSchema(value, helpers))
    .required(),
  orderItems: Joi.array().items(orderItemSchema).required(),
}).options({ abortEarly: false, allowUnknown: false });

const updateOrderStatusJoiSchema = Joi.object({
  status: Joi.string().valid('Open', 'Paid', 'Canceled', 'Closed').required(),
}).options({ abortEarly: false, allowUnknown: false });
const item = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required();

const updateDishStatusJoiSchema = Joi.object({
  status: Joi.string().valid('Ordered', 'In progress', 'Ready', 'Served').required(),
}).options({ abortEarly: false, allowUnknown: false });

const updateOrderStatusesToPaid = Joi.object({
  orders: Joi.array().items(item).required(),
});

module.exports = {
  createOrderJoiSchema,
  updateOrderStatusJoiSchema,
  updateDishStatusJoiSchema,
  updateOrderStatusesToPaid,
};
