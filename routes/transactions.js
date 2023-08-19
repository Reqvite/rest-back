const express = require('express');
const transactionsController = require('../controllers/TransactionsController');
const {
  createOnlineTransactionSchema,
  callbackTransactionSchema,
  createOfflineTransactionSchema,
} = require('../middleware/joiSchemas/transactionJoiSchemas');
const { validateBody, validateObjectId } = require('../middleware/validations');
const checkAuth = require('../middleware/authorization/checkAuth');
const router = express.Router();

router.post(
  '/',
  validateBody(createOnlineTransactionSchema),
  transactionsController.createPayOnline
);
router.post(
  '/manual/:rest_id',
  checkAuth(['admin', 'waiter']),
  validateBody(createOfflineTransactionSchema),
  transactionsController.createPayOffline
);
router.post(
  '/status',
  validateBody(callbackTransactionSchema),
  transactionsController.updateStatus
);

router.get('/:rest_id', checkAuth(['admin']), transactionsController.getTransactions);

router.get(
  '/statistics/:rest_id',
  validateObjectId,
  checkAuth(['admin']),
  transactionsController.getTransactionsStatisticsByRestaurantId
);

module.exports = router;

/**
 * @openapi
 * paths:
 *   /transactions/statistics/{rest_id}:
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Get transaction statistics by restaurant ID
 *       parameters:
 *         - in: path
 *           name: rest_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the restaurant for which transaction statistics are being retrieved.
 *         - in: query
 *           name: timestamp
 *           schema:
 *             type: string
 *             enum: [year, month, week]
 *           description: The time interval for which statistics should be retrieved.
 *       responses:
 *         '200':
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   statistics:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         amount:
 *                           type: number
 *                         transactions:
 *                           type: integer
 *                         online:
 *                           type: integer
 *                         pos:
 *                           type: integer
 *                         cash:
 *                           type: integer
 *                         name:
 *                           type: integer
 *         '401':
 *           description: Access denied.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 example:
 *                   message: "User authorization failed. Access denied."
 *   /transactions/{rest_id}:
 *     get:
 *       tags:
 *         - Transactions
 *       summary: Get transactions by admin
 *       parameters:
 *         - in: path
 *           name: rest_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the restaurant for which transactions are being retrieved.
 *         - in: query
 *           name: pageIndex
 *           schema:
 *             type: integer
 *           description: The index of the page to retrieve.
 *         - in: query
 *           name: pageSize
 *           schema:
 *             type: integer
 *           description: The number of transactions per page.
 *         - in: query
 *           name: today
 *           schema:
 *             type: string
 *             enum: [true, false]
 *           description: Filter transactions for today.
 *         - in: query
 *           name: userType
 *           schema:
 *             type: string
 *             enum: [customer, admin, waiter]
 *           description: Filter transactions by user type.
 *         - in: query
 *           name: transactionType
 *           schema:
 *             type: string
 *             enum: [cash, POS, online]
 *           description: Filter transactions by type.
 *         - in: query
 *           name: date
 *           schema:
 *             type: string
 *             format: date
 *           description: Filter transactions by a specific date.
 *       responses:
 *         '200':
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   tableTransactions:
 *                     type: object
 *                     properties:
 *                       transactions:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Transaction'  # Reference to the transaction schema definition
 *                       pageCount:
 *                         type: integer
 *                       currentPageIndex:
 *                         type: integer
 *         '401':
 *           description: Access denied.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 example:
 *                   message: "User authorization failed. Access denied."
 *   /transactions:
 *     post:
 *       tags:
 *         - Transactions
 *       summary: Creates a payment data for customer
 *       requestBody:
 *         description: Payment data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                 info:
 *                   type: string
 *                 frontLink:
 *                   type: string
 *                 rest_id:
 *                   type: string
 *               required:
 *                 - amount
 *                 - info
 *                 - frontLink
 *                 - rest_id
 *             example:
 *               amount: 1
 *               info: "64c58973860d0119306ee2e8,64c58973860d0119306ee2e9,64c58973860d0119306ee2e1,64c58973860d0119306ee2e9"
 *               frontLink: "http://localhost:3000/"
 *               rest_id: "64c4fdea4055a7111092df34"
 *       responses:
 *         '200':
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   data:
 *                     type: string
 *                   signature:
 *                     type: string
 *               example:
 *                 data: "eyJwdWJsaWNfa2V5Ijoic2FuZGJveF9pNjA4MDU4ODg4MDQiLCJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXkiLCJhbW91bnQiOjEsImN1cnJlbmN5IjoiVVNEIiwiZGVzY3JpcHRpb24iOiJQYXltZW50IGZvciB0aGUgXCJBbGwgQnJvdGhlcnNcIiByZXN0YXVyYW50IGJpbGwuIiwib3JkZXJfaWQiOiI2NGUwYjQzNmVhMWQ2NGIyN2IzMDZjMmIiLCJpbmZvIjoiNjRjNTg5NzM4NjBkMDExOTMwNmVlMmU4LDY0YzU4OTczODYwZDAxMTkzMDZlZTJlOSwgNjRjNTg5NzM4NjBkMDExOTM0MDZlZTJlMSwgNjRjNTg5NzM4NjBkMDExOTMwNmVlMmU5IiwicmVzdWx0X3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8iLCJzZXJ2ZXJfdXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL3RyYW5zYWN0aW9ucy9zdGF0dXMifQ=="
 *                 signature: "Zk2BH8i+tJD8M+++bn38rwzS41o="
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *               example:
 *                 message: "Bad request message"
 *   /transactions/status:
 *     post:
 *       tags:
 *         - Transactions
 *       summary: Create transaction after liqpay callback with success status
 *       requestBody:
 *         description: Payment data and signature
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: The payment data.
 *                 signature:
 *                   type: string
 *                   description: The signature for the payment data.
 *               example:
 *                 data: "eyJwdWJsaWNfa2V5Ijoic2FuZGJveF9pNjA4MDU4ODg4MDQiLCJ2ZXJzaW9uIjozLCJhY3Rpb24iOiJwYXkiLCJhbW91bnQiOjEsImN1cnJlbmN5IjoiVVNEIiwiZGVzY3JpcHRpb24iOiJQYXltZW50IGZvciB0aGUgXCJBbGwgQnJvdGhlcnNcIiByZXN0YXVyYW50IGJpbGwuIiwib3JkZXJfaWQiOiI2NGUwYjQzNmVhMWQ2NGIyN2IzMDZjMmIiLCJpbmZvIjoiNjRjNTg5NzM4NjBkMDExOTMwNmVlMmU4LDY0YzU4OTczODYwZDAxMTkzMDZlZTJlOSwgNjRjNTg5NzM4NjBkMDExOTM0MDZlZTJlMSwgNjRjNTg5NzM4NjBkMDExOTMwNmVlMmU5IiwicmVzdWx0X3VybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC8iLCJzZXJ2ZXJfdXJsIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL3RyYW5zYWN0aW9ucy9zdGF0dXMifQ=="
 *                 signature: "Zk2BH8i+tJD8M+++bn38rwzS41o="
 *       responses:
 *         '204':
 *           description: No Content.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: integer
 *                     example: 204
 *                   status:
 *                     type: string
 *                     example: success
 *   /transactions/manual/{rest_id}:
 *     post:
 *       tags:
 *         - Transactions
 *       summary: Creates transaction by waiter or admin
 *       requestBody:
 *         description: Transaction data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 createById:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 type:
 *                   type: string
 *               required:
 *                 - createById
 *                 - info
 *                 - amount
 *                 - type
 *             example:
 *               amount: 1
 *               info: "64c58973860d0119306ee2e8,64c58973860d0119306ee2e9,64c58973860d0119306ee2e1,64c58973860d0119306ee2e9"
 *               createById: "2331212121"
 *               type: "Cash"
 *       responses:
 *         '201':
 *           description: Success
 *         '400':
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *               example:
 *                 message: "Bad request message"
 *         '401':
 *           description: Access denied.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 example:
 *                   message: "User authorization failed. Access denied."
 */
