const { Order } = require("../models");
const Table = require("../models/tableModel");
const Restaurant = require("../models/restaurantModel");
const getOrderById = async (req, res) => {
  const restId = req.params.restId;
  const orderId = req.params.orderId;

  return res.json({
    status: "success",
    code: 200,
    data: {
      restId,
      orderId,
    },
  });
};

const getOrderByTableId = async (req, res) => {
  const restId = req.params.restId;
  const tableId = req.params.tableId;

  return res.json({
    status: "success",
    code: 200,
    data: {
      restId,
      tableId,
    },
  });
};

const createOrder = async (req, res) => {
  const { restId } = req.params;
  const orderData = req.body;
  const { table_id } = orderData;
  try {
    const restaurant = await Restaurant.findById(restId);
    console.log(restaurant);
  } catch (error) {
    console.log(error);
  }

  const table = await Table.findById(table_id);

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
        restId,
        order,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  return res.json({
    code: 200,
    status: "success",
    data: {
      orderId,
    },
  });
};

const updateDishStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const dishId = req.params.dishId;
  return res.json({
    code: 200,
    status: "success",
    data: {
      orderId,
      dishId,
    },
  });
};

module.exports = {
  getOrderById,
  getOrderByTableId,
  createOrder,
  updateOrderStatus,
  updateDishStatus,
};
