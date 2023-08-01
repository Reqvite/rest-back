const { Order, Table, Dish } = require('../models');
const { NotFoundError } = require('../utils/errors/CustomErrors');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');

const getOrderById = asyncErrorHandler(async (req, res, next) => {
  const { restId, orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    rest_id: restId,
  })
    .populate({ path: 'orderItems.dish', select: 'name picture price' })
    .exec();

  if (!order) {
    next(new NotFoundError('Order not found'));
  }
  res.json({
    status: 'success',
    code: 200,
    data: {
      order,
    },
  });
});

const getOrdersByTableId = asyncErrorHandler(async (req, res, next) => {
  const { restId, tableId } = req.params;

  const table = await Table.exists({ restaurant_id: restId, _id: tableId });
  if (!table) {
    next(new NotFoundError('No table with this id was found in this restaurant'));
  }
  const orders = await Order.find({ rest_id: restId, table_id: tableId })
    .populate({ path: 'orderItems.dish', select: 'name picture price' })
    .exec();

  res.json({
    status: 'success',
    code: 200,
    data: {
      orders,
    },
  });
});

const createOrder = asyncErrorHandler(async (req, res, next) => {
  const restId = req.params.restId;
  const orderData = req.body;
  const { table_id } = orderData;

  const table = await Table.findOne({ _id: table_id, restaurant_id: restId });
  if (!table) {
    next(new NotFoundError('Table not found'));
  }
  const data = {
    ...orderData,
    rest_id: restId,
  };

  const order = await Order.create(data);
  res.status(201).json({
    message: 'Created',
    data: {
      order,
    },
  });
});

const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { restId, orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, rest_id: restId },
    { status },
    { new: true }
  );
  if (!order) {
    next(new NotFoundError('Order not found'));
  }
  res.json({
    code: 200,
    status: 'success',
    data: {
      order,
    },
  });
});

const updateDishStatus = asyncErrorHandler(async (req, res, next) => {
  const { restId, orderId, dishId } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, rest_id: restId, 'orderItems.dish': dishId },
    {
      $set: { 'orderItems.$.status': status },
    },
    { new: true }
  );
  if (!order) {
    next(new NotFoundError('Order or Dish not found'));
  }
  res.json({
    code: 200,
    status: 'success',
    data: {
      order,
    },
  });
});

module.exports = {
  getOrderById,
  getOrdersByTableId,
  createOrder,
  updateOrderStatus,
  updateDishStatus,
};
