const Joi = require('joi');

const orderItemSchema = Joi.object({
  dish_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  quantity: Joi.number().integer().min(1).required(),
  status: Joi.string().valid('Ordered', 'In progress', 'Ready', 'Served').optional(),
});

const createOrderJoiSchema = Joi.object({
  status: Joi.string().valid('Open', 'Paid', 'Canceled').optional(),
  table_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  orderItems: Joi.array().items(orderItemSchema).required(),
}).options({ abortEarly: false, allowUnknown: false });

const updateOrderStatusJoiSchema = Joi.object({
  status: Joi.string().valid('Open', 'Paid', 'Canceled').required(),
});

const updateDishStatusJoiSchema = Joi.object({
  status: Joi.string().valid('Ordered', 'In progress', 'Ready', 'Served').required(),
});

module.exports = {
  createOrderJoiSchema,
  updateOrderStatusJoiSchema,
  updateDishStatusJoiSchema,
};
