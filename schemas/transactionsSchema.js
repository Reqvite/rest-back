/**
 * @openapi
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - paymentAmount
 *         - paymentDate
 *         - liqPayOrder_id
 *         - restaurantOrders_id
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique ID of the transaction.
 *         paymentAmount:
 *           type: number
 *           description: The amount of the payment transaction.
 *         paymentDate:
 *           type: string
 *           format: date
 *           description: The date of the payment transaction.
 *         restaurantOrders_id:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of IDs of the orders associated with the transaction.
 *         type:
 *           type: string
 *           enum: ['cash', 'POS', 'online']
 *           description: The type of transaction.
 */
