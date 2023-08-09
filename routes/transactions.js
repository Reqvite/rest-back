const express = require('express');
const transactionsController = require('../controllers/TransactionsController');
const {
  createOnlineTransactionSchema,
  callbackTransactionSchema,
  createOfflineTransactionSchema,
} = require('../middleware/joiSchemas/transactionJoiSchemas');
const { validateBody } = require('../middleware/validations');
const router = express.Router();

router.post(
  '/',
  validateBody(createOnlineTransactionSchema),
  transactionsController.createPayOnline
);
router.post(
  '/manual',
  validateBody(createOfflineTransactionSchema),
  transactionsController.createPayOffline
);
router.post(
  '/status',
  validateBody(callbackTransactionSchema),
  transactionsController.updateStatus
);

module.exports = router;

/**
 * @openapi
 * paths:
 *   /transactions:
 *     post:
 *       tags:
 *         - Transactions
 *       summary: Creates a new transaction
 *       requestBody:
 *         description: Transaction data
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       responses:
 *         '201':
 *           description: Transaction created
 *
 *   /transactions/status:
 *     post:
 *       tags:
 *         - Transactions
 *       summary: Updates payment status for orders
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
 */
