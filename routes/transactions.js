const express = require("express");
const transactionsController = require("../controllers/TransactionsController");
const router = express.Router();

router.post("/", transactionsController.create);
router.post("/status", transactionsController.updateStatus);

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
 *         '200':
 *           description: Success response with updated orders.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: integer
 *                     example: 200
 *                   status:
 *                     type: string
 *                     example: success
 *                   data:
 *                     type: object
 *                     properties:
 *                       updatedOrders:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Order'
 */
