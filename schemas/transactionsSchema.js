/**
 * @openapi
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - _id
 *         - paymentAmount
 *         - paymentDate
 *         - order_id
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
 *         order_id:
 *           type: string
 *           description: The unique ID of the order associated with the transaction.
 *         type:
 *           type: string
 *           enum: ['online', 'POS', 'cash']
 *           description: The type of transaction.
 */
