const express = require('express');
const router = express.Router();
const { tables } = require('../controllers');
const { updateTableJoiSchema } = require('../middleware/joiSchemas/tableJoiSchemas');
const {
  validateObjectId,
  validateBody,
  // checkSeatsNumber,
  // checkTableNumber,
  // checkExistingTable,
} = require('../middleware/validations');
const checkWaiterAuth = require('../middleware/authorization/waiterAuth');

/**
 * @openapi
 * paths:
 *   /tables/restaurant/{restaurantId}:
 *     get:
 *       tags:
 *         - Tables
 *       summary: Get all tables by restaurant
 *       parameters:
 *         - name: restaurantId
 *           in: path
 *           required: true
 *           description: The ID of the restaurant.
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: A list of tables
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Table'
 *   /tables/{tableId}:
 *     get:
 *       tags:
 *         - Tables
 *       summary: Get table by id
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           type: string
 *       responses:
 *         200:
 *           description: A single table
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Table'
 *     patch:
 *       tags:
 *         - Tables
 *       summary: Update table
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           type: string
 *       responses:
 *         '204':
 *           description: No content
 *           schema:
 *             $ref: '#/components/schemas/Table'
 */

// const ctrlWrapper = (ctrl) => {
//   return async (req, res, next) => {
//     try {
//       await ctrl(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

router.get('/:id/restaurant/:rest_id', validateObjectId, tables.getTable);
router.get('/restaurant/:rest_id', validateObjectId, tables.getTablesByRestaurantId);
router.patch(
  '/:id',
  validateObjectId,
  checkWaiterAuth,
  // checkSeatsNumber,
  // checkTableNumber,
  // checkExistingTable,
  validateBody(updateTableJoiSchema),
  tables.updateTable
);

module.exports = router;
