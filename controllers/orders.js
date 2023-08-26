const mongoose = require('mongoose');
const { Order, Table, Dish } = require('../models');
const { NotFoundError, BadRequestError } = require('../utils/errors/CustomErrors');
const asyncErrorHandler = require('../utils/errors/asyncErrorHandler');
const { sendEventToClients } = require('../utils/sse');
const { getSignedUrl } = require('../utils/s3');

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
  for (const item of order.orderItems) {
    const dish = item.dish;

    if (dish.picture) {
      dish.picture = await getSignedUrl(dish);
    }
  }

  res.json({
    status: 'success',
    code: 200,
    order,
  });
});

const getOrdersByTableId = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, tableId } = req.params;

  const orders = await Order.find({ rest_id, table_id: tableId, status: { $ne: 'Closed' } })
    .populate({ path: 'orderItems.dish', select: 'name picture price' })
    .exec();

 const processedDishes = new Map(); 

  for (const order of orders) {
    for (const item of order.orderItems) {
      const dish = item.dish;

      if (dish.picture) {
        if (!processedDishes.has(dish._id)) {
          dish.picture = await getSignedUrl(dish);
          processedDishes.set(dish._id, dish.picture);
        } else {
          dish.picture = processedDishes.get(dish._id);
        }
      }
    }
  }

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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Order.create(data);
    await Table.findOneAndUpdate(
      { _id: table_id, restaurant_id: rest_id },
      { $set: { status: 'Taken' } }
    );
    await session.commitTransaction();
    const eventMessage = JSON.stringify(`${table_id}`);
    const eventType = 'new order';
    sendEventToClients(rest_id, eventMessage, eventType);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
  res.status(201).json({
    message: 'Created',
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
  const eventMessage = JSON.stringify(`${tableId}`);
  const eventType = 'update order status';
  sendEventToClients(rest_id, eventMessage, eventType);

  res.json({
    code: 200,
    status: 'success',
    message: 'Orders status updated',
  });
});

const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate({ _id: orderId, rest_id }, { status }, { new: true });
  if (!order) {
    return next(new NotFoundError('Order not found'));
  }
  const eventMessage = JSON.stringify(`${order.table_id}`);
  const eventType = 'update order status';
  sendEventToClients(rest_id, eventMessage, eventType);

  res.json({
    code: 200,
    status: 'success',
  });
});

const updateReadyDishesToServed = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, orderId } = req.params;
  const order = await Order.findOneAndUpdate(
    { _id: orderId, rest_id },
    {
      $set: { 'orderItems.$[item].status': 'Served' },
    },
    { new: true, arrayFilters: [{ 'item.status': 'Ready' }] }
  );
  if (!order) {
    return next(new NotFoundError('Order or Dish not found'));
  }
  const eventMessage = JSON.stringify(`${order.table_id}`);
  const eventType = 'dish status';
  sendEventToClients(rest_id, eventMessage, eventType);

  res.json({
    code: 200,
    status: 'success',
    message: 'updated',
  });
});
const updateDishStatus = asyncErrorHandler(async (req, res, next) => {
  const { rest_id, orderId, dishId } = req.params;
  const { status } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: orderId, rest_id, 'orderItems.dish': dishId },
    {
      $set: { 'orderItems.$.status': status },
    }
   
  );
  if (!order) {
    return next(new NotFoundError('Order or Dish not found'));
  }
  const dish = await Dish.findById(dishId);
  const table = await Table.findById(order.table_id);
const previousDishStatus = order.orderItems.find(
    (item) => item.dish.toString() === dishId
  ).status;
  if (previousDishStatus === 'Ready' && status === 'In progress') {
    const eventMessage = `${dish.name} from table #${table.table_number} return to cooking`;
    const eventType = 'dish is ready';
    sendEventToClients(rest_id, eventMessage, eventType);
  }

  if (status === 'Ready') {
    const eventMessage = `${dish.name} from table #${table.table_number} is ready`;
    const eventType = 'dish is ready';
    sendEventToClients(rest_id, eventMessage, eventType);
  }

  const eventMessage = JSON.stringify(`${order.table_id}`);
  const eventType = 'dish status';
  sendEventToClients(rest_id, eventMessage, eventType);

  res.json({
    code: 200,
    status: 'success',

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
  updateReadyDishesToServed,
};
