const express = require('express');
const transactionsController = require('../controllers/TransactionsController');
const router = express.Router();

/**
 * @openapi
 * paths:
 *   /transactions:
 *     post:
 *       tags:
 *         - Transactions
 *       summary: Creates a new transaction
 *       parameters:
 *         - in: body
 *           name: transaction
 *           schema:
 *             $ref: '#/definitions/Transaction'
 *       responses:
 *         '201':
 *           description: Transaction created
 *
 * definitions:
 *   Transaction:
 *     type: object
 *     properties:
 *       paymentAmount:
 *         type: number
 *         description: The amount of the payment transaction.
 *       paymentDate:
 *         type: string
 *         format: date
 *         description: The date of the payment transaction.
 *       order_id:
 *         type: string
 *         description: The unique ID of the order associated with the transaction.
 *       type:
 *         type: string
 *         enum: ['cash', 'POS', 'online']
 *         description: The type of transaction.
 */

router.post('/', transactionsController.create);


module.exports = router;