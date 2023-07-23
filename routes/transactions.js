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
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Returns a list of all transactions
 *       responses:
 *         '200':
 *           description: A list of transactions
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Transaction'
 *
 *   /transactions/{transactionId}:
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Returns a transaction by ID
 *       parameters:
 *         - in: path
 *           name: transactionId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: A transaction
 *           schema:
 *             $ref: '#/definitions/Transaction'
 *     put:
 *       tags:
 *         - Transactions
 *       summary: Updates a transaction
 *       parameters:
 *         - in: path
 *           name: transactionId
 *           required: true
 *           type: string
 *         - in: body
 *           name: transaction
 *           schema:
 *             $ref: '#/definitions/Transaction'
 *       responses:
 *         '200':
 *           description: Transaction updated
 *     delete:
 *       tags:
 *         - Transactions
 *       summary: Deletes a transaction
 *       parameters:
 *         - in: path
 *           name: transactionId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: Transaction deleted
 *
 *   /transactions/type/{type}:
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Returns transactions by type
 *       parameters:
 *         - in: path
 *           name: type
 *           required: true
 *           type: string
 *           enum: ['cash', 'POS', 'online']
 *       responses:
 *         '200':
 *           description: A list of transactions
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Transaction'
 *
 *   /transactions/order/{orderId}:
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Returns transactions by order ID
 *       parameters:
 *         - in: path
 *           name: orderId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: A list of transactions
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Transaction'
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


router.get('/', transactionsController.getAll);
router.post('/', transactionsController.create);
router.put('/:id', transactionsController.update);
router.delete('/:id', transactionsController.delete);
router.get('/:id', transactionsController.getOne);
router.get('/type/:type', transactionsController.getByType);
router.get('/order/:orderId', transactionsController.getByOrder);

module.exports = router;