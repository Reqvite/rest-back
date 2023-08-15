const { Order, Table, Dish } = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/errors/CustomErrors');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { sendEventToClients } = require('../utils/sse');

const getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const { rest_id } = req.params;

  const orders = await Order.find({ rest_id, status: { $ne: 'Closed' } })
    .populate({ path: 'orderItems.dish', select: 'name picture quantity' })
    .populate({
      path: 'table_id',
      select: 'table_number',
    })
    .exec();

  if (!orders) {
    return next(new NotFoundError('Order not found'));
  }
  res.json({
    status: 'success',
    code: 200,
    orders,
  });
});

const getOrderById = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    rest_id,
  })
    .populate({ path: 'orderItems.dish', select: 'name picture price' })
    .exec();

  if (!order) {
    return next(new NotFoundError('Order not found'));
  }
  res.json({
    status: 'success',
    code: 200,
    order,
  });
});

const getOrdersByTableId = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, tableId } = req.params;

  const table = await Table.exists({
    restaurant_id: rest_id,
    _id: tableId,
  });
  if (!table) {
    return next(new NotFoundError('No table with this id was found in this restaurant'));
  }
  const orders = await Order.find({ rest_id, table_id: tableId, status: { $ne: 'Closed' } })
    .populate({ path: 'orderItems.dish', select: 'name picture price' })
    .exec();

  res.json({
    status: 'success',
    code: 200,
    orders,
  });
});

const createOrder = asyncErrorHandler(async (req, res, next) => {
  const { rest_id } = req.params;
  const orderData = req.body;
  const { table_id } = orderData;

  const table = await Table.findOne({ _id: table_id, restaurant_id: rest_id });
  if (!table) {
    return next(new NotFoundError('Table not found'));
  }
  const uniqueDishIds = new Set();
  for (const item of orderData.orderItems) {
    if (uniqueDishIds.has(item.dish)) {
      return next(new BadRequestError('Duplicate dish IDs found in orderItems'));
    }
    uniqueDishIds.add(item.dish);
  }

  const dishIds = orderData.orderItems.map((item) => item.dish);
  const dishes = await Dish.find({ _id: { $in: dishIds } });
  if (dishes.length !== dishIds.length) {
    return next(new NotFoundError('One or more dish IDs not found'));
  }

  const data = {
    ...orderData,
    rest_id,
  };

  const order = await Order.create(data);

  const eventMessage = JSON.stringify(`New order`);
  const eventType = 'New order';
  sendEventToClients(rest_id, eventMessage, eventType);

  res.status(201).json({
    message: 'Created',
    order,
  });
});

const updateOrderStatusesToPaid = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, tableId } = req.params;
  const { orders } = req.body;
  const table = await Table.exists({
    restaurant_id: rest_id,
    _id: tableId,
  });
  if (!table) {
    return next(new NotFoundError('No table with this id was found in this restaurant'));
  }
  const updatedOrders = await Order.updateMany(
    {
      rest_id,
      table_id: tableId,
      _id: { $in: orders },
    },
    { $set: { status: 'Paid' } }
  );
  if (!updatedOrders) {
    return next(new NotFoundError('Orders not found'));
  }
  res.json({
    code: 200,
    status: 'Orders status updated',
  });
});

const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate({ _id: orderId, rest_id }, { status }, { new: true });
  if (!order) {
    return next(new NotFoundError('Order not found'));
  }
  res.json({
    code: 200,
    status: 'success',
    order,
  });
});

const updateDishStatus = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, orderId, dishId } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, rest_id, 'orderItems.dish': dishId },
    {
      $set: { 'orderItems.$.status': status },
    },
    { new: true }
  );
  if (!order) {
    return next(new NotFoundError('Order or Dish not found'));
  }
  if (status === 'Ready') {
    const eventMessage = `Dish is ready`;
    const eventType = 'dish is ready';
    sendEventToClients(rest_id, eventMessage, eventType);
  }

  const eventMessage = JSON.stringify('Dish status updated');
  const eventType = 'dish status';
  sendEventToClients(rest_id, eventMessage, eventType);

  res.json({
    code: 200,
    status: 'success',
    order,
  });
});

module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByTableId,
  createOrder,
  updateOrderStatus,
  updateDishStatus,
  updateOrderStatusesToPaid,
};
