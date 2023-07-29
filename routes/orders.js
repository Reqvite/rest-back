const express = require("express");
const router = express.Router();

const { orders } = require("../controllers");
const checkRestId = require("../middleware/checkRestId");

router.get("/:restId/table/:tableId", checkRestId, orders.getOrdersByTableId);
router.get("/:restId/:orderId", checkRestId, orders.getOrderById);
router.post("/:restId", checkRestId, orders.createOrder);
router.patch("/:restId/:orderId", checkRestId, orders.updateOrderStatus);
router.patch("/:restId/:orderId/:dishId", checkRestId, orders.updateDishStatus);

module.exports = router;

/**
 * @openapi
 * paths:
 *   /orders/{restId}/{orderId}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get order by id
 *       parameters:
 *         - in: path
 *           name: restId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *         - in: path
 *           name: orderId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *       responses:
 *         '200':
 *           description: Get an order
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                  status:
 *                    type: string
 *                    description: response status text
 *                    example: success
 *                  code:
 *                    type: integer
 *                    descriptio: response status code
 *                    example: 200
 *                  data:
 *                    type: object
 *                    properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         status:
 *                            type: string
 *                            enum:
 *                              - Open
 *                              - Paid
 *                              - Canceled
 *                            default: Open
 *                            example: Open
 *                         orderItems:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               dish:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     format: ObjectId
 *                                     example: 64c4fdea4055a7111092df32
 *                                   name:
 *                                     type: string
 *                                     example: Pizza
 *                                   picture:
 *                                     type: string
 *                                     example: https://cloudinary/some-img.jpg
 *                                   price:
 *                                     type: number
 *                                     example: 11.99
 *                               quantity:
 *                                 type: integer
 *                                 example: 3
 *                               status:
 *                                 type: string
 *                                 enum:
 *                                   - Ordered
 *                                   - In progress
 *                                   - Ready
 *                                   - Served
 *                                 default: Ordered
 *                                 example: In progress
 *                         table_id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         rest_id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *         '400':
 *           description: Bad request
 *         '404':
 *           description: Order not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update order status
 *       parameters:
 *         - in: path
 *           name: restId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *         - in: path
 *           name: orderId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *       requestBody:
 *         description: New order status
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - Open
 *                     - Paid
 *                     - Canceled
 *                   example: Paid
 *       responses:
 *         '200':
 *           description: Status updated
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                  status:
 *                    type: string
 *                    description: response status text
 *                    example: success
 *                  code:
 *                    type: integer
 *                    descriptio: response status code
 *                    example: 200
 *                  data:
 *                    type: object
 *                    properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         status:
 *                            type: string
 *                            enum:
 *                              - Open
 *                              - Paid
 *                              - Canceled
 *                            default: Open
 *                            example: Paid
 *                         orderItems:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               dish:
 *                                 type: string
 *                                 format: ObjectId
 *                                 example: 64c4fdea4055a7111092df32
 *                               quantity:
 *                                 type: integer
 *                                 example: 3
 *                               status:
 *                                 type: string
 *                                 enum:
 *                                   - Ordered
 *                                   - In progress
 *                                   - Ready
 *                                   - Served
 *                                 default: Ordered
 *                                 example: In progress
 *                         table_id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         rest_id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '404':
 *           description: Order not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /orders/{restId}:
 *     post:
 *       tags:
 *         - Orders
 *       summary: Create an order
 *       parameters:
 *         - in: path
 *           name: restId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *       requestBody:
 *         description: Order data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - Open
 *                     - Paid
 *                     - Canceled
 *                   example: Open
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dish:
 *                         type: string
 *                         required: true
 *                         format: ObjectId
 *                         example: 64c4fdea4055a7111092df32
 *                       quantity:
 *                         type: integer
 *                         example: 3
 *                       status:
 *                         type: string
 *                         enum:
 *                           - Ordered
 *                           - In progress
 *                           - Ready
 *                           - Served
 *                         default: Ordered
 *                         example: Ordered
 *                 table_id:
 *                   type: string
 *                   required: true
 *                   format: ObjectId
 *                   example: 64c4fdea4055a7111092df32
 *       responses:
 *         '201':
 *           description: Order created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: response status message
 *                     example: Created
 *                   data:
 *                     type: object
 *                     properties:
 *                       order:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *                           status:
 *                             type: string
 *                             enum:
 *                               - Open
 *                               - Paid
 *                               - Canceled
 *                             default: Open
 *                             example: Open
 *                           orderItems:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 dish:
 *                                   type: string
 *                                   format: ObjectId
 *                                   example: 64c4fdea4055a7111092df32
 *                                 quantity:
 *                                   type: integer
 *                                   example: 3
 *                                 status:
 *                                   type: string
 *                                   enum:
 *                                     - Ordered
 *                                     - In progress
 *                                     - Ready
 *                                     - Served
 *                                   default: Ordered
 *                                   example: Ordered
 *                           table_id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *                           rest_id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '404':
 *           description: Table not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /orders/{restId}/table/{tableId}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get orders by table id
 *       parameters:
 *         - in: path
 *           name: restId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *         - in: path
 *           name: tableId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *       responses:
 *         '200':
 *           description: List of orders from table
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: response status text
 *                     example: success
 *                   code:
 *                     type: integer
 *                     descriptio: response status code
 *                     example: 200
 *                   data:
 *                     type: object
 *                     properties:
 *                       order:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *                           status:
 *                             type: string
 *                             enum:
 *                               - Open
 *                               - Paid
 *                               - Canceled
 *                             default: Open
 *                             example: Open
 *                           orderItems:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 dish:
 *                                   type: object
 *                                   properties:
 *                                     _id:
 *                                       type: string
 *                                       format: ObjectId
 *                                       example: 64c4fdea4055a7111092df32
 *                                     name:
 *                                       type: string
 *                                       example: Pizza
 *                                     picture:
 *                                       type: string
 *                                       example: https://cloudinary/some-img.jpg
 *                                     price:
 *                                       type: number
 *                                       example: 11.99
 *                                 quantity:
 *                                   type: integer
 *                                   example: 3
 *                                 status:
 *                                   type: string
 *                                   enum:
 *                                     - Ordered
 *                                     - In progress
 *                                     - Ready
 *                                     - Served
 *                                   default: Ordered
 *                                   example: In progress
 *                           table_id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *                           rest_id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *         '400':
 *           description: Bad request
 *         '404':
 *           description: Orders not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /orders/{restId}/{orderId}/{dishId}:
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update dish status in order
 *       parameters:
 *         - in: path
 *           name: restId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *         - in: path
 *           name: orderId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *         - in: path
 *           name: dishId
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *       requestBody:
 *         description: New dish status
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - Ordered
 *                     - In progress
 *                     - Ready
 *                     - Served
 *                   example: In progress
 *       responses:
 *         '200':
 *           description: Status updated
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: response status text
 *                     example: success
 *                   code:
 *                     type: integer
 *                     descriptio: response status code
 *                     example: 200
 *                   data:
 *                     type: object
 *                     properties:
 *                       order:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *                           status:
 *                             type: string
 *                             enum:
 *                               - Open
 *                               - Paid
 *                               - Canceled
 *                             default: Open
 *                             example: Paid
 *                           orderItems:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 dish:
 *                                   type: string
 *                                   format: ObjectId
 *                                   example: 64c4fdea4055a7111092df32
 *                                 quantity:
 *                                   type: integer
 *                                   example: 3
 *                                 status:
 *                                   type: string
 *                                   enum:
 *                                     - Ordered
 *                                     - In progress
 *                                     - Ready
 *                                     - Served
 *                                   default: Ordered
 *                                   example: In progress
 *                           table_id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *                           rest_id:
 *                             type: string
 *                             format: ObjectId
 *                             example: 64c4fdea4055a7111092df32
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '404':
 *           description: Order or dish not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 */
