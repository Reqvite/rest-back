const express = require("express");
const router = express.Router();
const { orders } = require("../controllers");

router.get("/:orderId", orders.getOrderById);
router.get("/:tableId", orders.getOrderByTableId);
router.post("/", orders.createOrder);
router.patch("/:orderId", orders.updateOrderStatus);
router.patch("/:orderId/:dishId", orders.updateDishStatus);

module.exports = router;
