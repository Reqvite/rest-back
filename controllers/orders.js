const { Order, Table, Dish } = require("../models");

const getOrderById = async (req, res) => {
  const { restId, orderId } = req.params;

  try {
    const order = await Order.findOne({
      _id: orderId,
      rest_id: restId,
    })
      .populate({ path: "orderItems.dish", select: "name picture price" })
      .exec();

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    return res.json({
      status: "success",
      code: 200,
      data: {
        order,
      },
    });
  } catch (error) {
    console.log(error);
    //add error
  }
};

const getOrdersByTableId = async (req, res) => {
  const { restId, tableId } = req.params;

  try {
    const orders = await Order.find({ rest_id: restId, table_id: tableId })
      .populate({ path: "orderItems.dish", select: "name picture price" })
      .exec();
    if (!orders) {
      return res.status(404).json({
        message: "Orders not found",
      });
    }
    return res.json({
      status: "success",
      code: 200,
      data: {
        orders,
      },
    });
  } catch (error) {
    console.log(error);
    //add error
  }
};

const createOrder = async (req, res) => {
  const restId = req.params.restId;
  const orderData = req.body;
  const { table_id } = orderData;

  const table = await Table.findOne({ _id: table_id, restaurant_id: restId });
  if (!table) {
    return res.status(404).json({
      message: "Table not found",
    });
  }
  const data = {
    ...orderData,
    rest_id: restId,
  };
  try {
    const order = await Order.create(data);
    res.status(201).json({
      message: "Created",
      data: {
        order,
      },
    });
  } catch (error) {
    console.log(error);
    //add error
  }
};

const updateOrderStatus = async (req, res) => {
  const { restId, orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, rest_id: restId },
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Order not found",
      });
    }
    return res.json({
      code: 200,
      status: "success",
      data: {
        order,
      },
    });
  } catch (error) {
    console.log(error);
    //add error
  }
};

const updateDishStatus = async (req, res) => {
  const { restId, orderId, dishId } = req.params;

  const { status } = req.body;
  try {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, rest_id: restId, "orderItems.dish": dishId },
      {
        $set: { "orderItems.$.status": status },
      },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Order or Dish not found",
      });
    }
    return res.json({
      code: 200,
      status: "success",
      data: {
        order,
      },
    });
  } catch (error) {
    console.log(error);
    //add error
  }
};

module.exports = {
  getOrderById,
  getOrdersByTableId,
  createOrder,
  updateOrderStatus,
  updateDishStatus,
};
