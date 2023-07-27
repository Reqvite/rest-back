const express = require("express");
const router = express.Router();
const { orders } = require("../controllers");

router.get("/:orderId", orders.getOrderById);
router.get("/:tableId", orders.getOrderByTableId);
router.post("/", orders.createOrder);
router.post("/status", orders.updateOrderStatus);
router.patch("/:orderId/:dishId", orders.updateDishStatus);

module.exports = router;

/**
 * @openapi
 * paths:
 *   /orders/{orderId}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get order by id
 *       parameters:
 *         - in: path
 *           name: orderId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: Get an order
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Order'
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update order status
 *       parameters:
 *         - in: path
 *           name: orderId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: Status updated
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *
 *   /orders:
 *     post:
 *       tags:
 *         - Orders
 *       summary: Create an order
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       responses:
 *         '201':
 *           description: Order created successfully
 *
 *   /orders/{tableId}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get orders by table id
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: List of orders from table
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Order'
 *
 *   /orders/{orderId}/{dishId}:
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update dish status in order
 *       parameters:
 *         - in: path
 *           name: orderId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: Dish status updated
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *
 *
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - Open
 *             - Paid
 *           default: Open
 *         orderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dish:
 *                 type: string
 *                 format: objectId
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               status:
 *                 type: string
 *                 enum:
 *                   - Ordered
 *                   - In progress
 *                   - Ready
 *                   - Served
 *                 default: Ordered
 *         table_id:
 *           type: string
 *           format: objectId
 *           description: Table id is required
 *       required:
 *         - table_id
 *       example:
 *         status: Open
 *         orderItems:
 *           - dish: "615f438200bfc42dd4d7fdd2"
 *             quantity: 2
 *             status: Ordered
 *           - dish: "615f439700bfc42dd4d7fdd4"
 *             quantity: 1
 *             status: In progress
 *         table_id: "615f437d00bfc42dd4d7fdd0"
 *
 */
