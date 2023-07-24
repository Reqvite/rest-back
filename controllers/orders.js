const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  return res.json({
    status: "success",
    code: 200,
    data: {
      orderId,
    },
  });
};

const getOrderByTableId = async (req, res) => {
  const { tableId } = req.params;
  return res.json({
    status: "success",
    code: 200,
    data: {
      tableId,
    },
  });
};

const createOrder = async (req, res) => {
  const { restaurantId } = req.params;
  const { data } = req.body;
  res.json({
    code: 201,
    message: "Created",
    data: {
      restaurantId,
      data,
    },
  });
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
