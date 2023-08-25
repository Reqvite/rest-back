const express = require('express');
const router = express.Router();

const { orders } = require('../controllers');
const checkRestId = require('../middleware/checkRestId');
const { validateBody, validateObjectId } = require('../middleware/validations');
const {
  createOrderJoiSchema,
  updateOrderStatusJoiSchema,
  updateDishStatusJoiSchema,
  updateOrderStatusesToPaid,
} = require('../middleware/joiSchemas/ordersJoiSchemas');
const checkAuth = require('../middleware/authorization/checkAuth');

router.get(
  '/:rest_id',
  checkAuth(['admin', 'waiter', 'cook']),
  validateObjectId,
  orders.getAllOrders
);
router.get('/:rest_id/table/:tableId', validateObjectId, checkRestId, orders.getOrdersByTableId);
router.get('/:rest_id/:orderId', validateObjectId, checkRestId, orders.getOrderById);
router.post(
  '/:rest_id',
  validateObjectId,
  checkRestId,
  validateBody(createOrderJoiSchema),
  orders.createOrder
);
router.patch(
  '/:rest_id/table/:tableId',
  validateObjectId,
  checkAuth(['admin', 'waiter']),
  validateBody(updateOrderStatusesToPaid),
  orders.updateOrderStatusesToPaid
);
router.patch(
  '/:rest_id/dishes/:orderId',
  validateObjectId,
  checkAuth(['admin', 'waiter']),
  orders.updateReadyDishesToServed
);
router.patch(
  '/:rest_id/:orderId',
  validateObjectId,
  checkAuth(['admin', 'waiter']),
  validateBody(updateOrderStatusJoiSchema),
  orders.updateOrderStatus
);
router.patch(
  '/:rest_id/:orderId/:dishId',
  checkAuth(['admin', 'waiter', 'cook']),
  validateObjectId,
  validateBody(updateDishStatusJoiSchema),
  orders.updateDishStatus
);

module.exports = router;

/**
 * @openapi
 * paths:
 *   /orders/{rest_id}/{orderId}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get order by id
 *       parameters:
 *         - in: path
 *           name: rest_id
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
 *                   status:
 *                     type: string
 *                     description: response status text
 *                     example: success
 *                   code:
 *                     type: integer
 *                     descriptio: response status code
 *                     example: 200
 *                   order:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: ObjectId
 *                         example: 64c4fdea4055a7111092df32
 *                       status:
 *                         type: string
 *                         enum:
 *                           - Open
 *                           - Paid
 *                           - Canceled
 *                         default: Open
 *                         example: Open
 *                       orderItems:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             dish:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   format: ObjectId
 *                                   example: 64c4fdea4055a7111092df32
 *                                 name:
 *                                   type: string
 *                                   example: Pizza
 *                                 picture:
 *                                   type: string
 *                                   example: https://cloudinary/some-img.jpg
 *                                 price:
 *                                   type: number
 *                                   example: 11.99
 *                             quantity:
 *                               type: integer
 *                               example: 3
 *                             status:
 *                               type: string
 *                               enum:
 *                                 - Ordered
 *                                 - In progress
 *                                 - Ready
 *                                 - Served
 *                               default: Ordered
 *                               example: In progress
 *                       table_id:
 *                         type: string
 *                         format: ObjectId
 *                         example: 64c4fdea4055a7111092df32
 *                       rest_id:
 *                         type: string
 *                         format: ObjectId
 *                         example: 64c4fdea4055a7111092df32
 *                       created_at:
 *                         type: string
 *                         example: 2023-08-20T15:45:31.265Z
 *                       number:
 *                         type: string
 *                         example: 42222823
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
 *           name: rest_id
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
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '401':
 *           description: Anauthorized
 *         '404':
 *           description: Order not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /orders/{rest_id}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get orders by restaurant id
 *       parameters:
 *         - in: path
 *           name: rest_id
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *       responses:
 *         '200':
 *           description: Get orders
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
 *                     description: response status code
 *                     example: 200
 *                   orders:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         status:
 *                           type: string
 *                           enum:
 *                             - Open
 *                             - Paid
 *                             - Canceled
 *                           default: Open
 *                           example: Open
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
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               format: ObjectId
 *                               example: 64c4fdea4055a7111092df32
 *                             table_number:
 *                               type: number
 *                               example: 2
 *                         rest_id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         created_at:
 *                           type: string
 *                           example: 2023-08-20T14:25:10.052Z
 *                         number:
 *                           type: string
 *                           example: 36877812
 *         '400':
 *           description: Bad request
 *         '401':
 *           description: User authorization failed
 *         '404':
 *           description: Order not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *     post:
 *       tags:
 *         - Orders
 *       summary: Create an order
 *       parameters:
 *         - in: path
 *           name: rest_id
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
 *                   optional: true
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
 *                         required: true
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
 *                         optional: true
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
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '404':
 *           description: Table not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /orders/{rest_id}/table/{tableId}:
 *     get:
 *       tags:
 *         - Orders
 *       summary: Get orders by table id
 *       parameters:
 *         - in: path
 *           name: rest_id
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
 *                   orders:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         status:
 *                           type: string
 *                           enum:
 *                             - Open
 *                             - Paid
 *                             - Canceled
 *                           default: Open
 *                           example: Open
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
 *                         created_at:
 *                           type: string
 *                           example: 2023-08-20T15:45:31.265Z
 *                         number:
 *                           type: string
 *                           example: 42222823
 *         '400':
 *           description: Bad request
 *         '404':
 *           description: Orders not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update order statuses to paid
 *       parameters:
 *         - in: path
 *           name: rest_id
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
 *       requestBody:
 *         description: Array of order id's
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: ObjectId
 *                     example: 64c4fdea4055a7111092df32
 *       responses:
 *         '200':
 *           description: Statuses updated
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
 *                   message:
 *                     type: string
 *                     example: orders status updated
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '401':
 *           description: Anauthorized
 *         '404':
 *           description: Order or dish not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /orders/{rest_id}/{orderId}/{dishId}:
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update dish status in order
 *       parameters:
 *         - in: path
 *           name: rest_id
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
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '401':
 *           description: Anauthorized
 *         '404':
 *           description: Order or dish not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /orders/{rest_id}/dishes/{orderId}:
 *     patch:
 *       tags:
 *         - Orders
 *       summary: Update ready dishes statuses to served
 *       parameters:
 *         - in: path
 *           name: rest_id
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
 *           description: Statuses updated
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
 *                     description: response status code
 *                     example: 200
 *                   message:
 *                     type: string
 *                     example: updated
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '401':
 *           description: Anauthorized
 *         '404':
 *           description: Order or dish not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 */
