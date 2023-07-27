const express = require("express");
const transactionsController = require("../controllers/TransactionsController");
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
 *             $ref: '#/components/schemas/Transaction'
 *       responses:
 *         '201':
 *           description: Transaction created
 */

router.post("/", transactionsController.create);

module.exports = router;
