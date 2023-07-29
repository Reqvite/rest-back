const express = require("express");
const router = express.Router();

const tableController = require("../controllers/TablesControllers");
const {
  checkSeatsNumber,
  checkTableNumber,
  checkRestaurantId,
  checkExistingTable,
} = require("../utils/validation/aditionalValidation");

/**
 * @openapi
 * paths:
 *   /table/restaurant/{restaurantId}:
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
 *   /table/{tableId}:
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

const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

//прибрати
router.get("/", ctrlWrapper(tableController.getAllTables));

router.get("/:id", ctrlWrapper(tableController.getTable));
router.get(
  "/restaurant/:id",
  ctrlWrapper(tableController.getTablesByRestaurantId)
);
router.patch("/:id", [
  checkSeatsNumber,
  checkTableNumber,
  checkRestaurantId,
  checkExistingTable,
  ctrlWrapper(tableController.updateTable),
]);

module.exports = router;
