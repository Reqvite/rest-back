const express = require('express');
const router = express.Router();
const dishController = require('../controllers/DishController');
const { validateBody, validateQuery, validateObjectId } = require('../middleware/validations');
const { dishJoiSchema, dishRequestJoiSchema } = require('../middleware/joiSchemas/dishJoiSchemas');
const checkAuth = require('../middleware/authorization/checkAuth');

/**
 * @openapi
 * paths:
 *   /dishes/restaurant/{restId}:
 *     get:
 *       tags:
 *         - Dishes
 *       summary: Get all dishes by restaurant id.
 *       parameters:
 *          - in: path
 *            name: restId
 *            required: true
 *            schema:
 *             type: string
 *          - in: query
 *            name: type
 *            required: false
 *            description: "Filter dish types"
 *            schema:
 *             type: string
 *          - in: query
 *            name: isActive
 *            required: false
 *            description: "Filter dishes by isActive status"
 *            schema:
 *            type: boolean
 *       responses:
 *         200:
 *           description: Returns a list of dishes.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Dish'
 *
 *     post:
 *       tags:
 *         - Dishes
 *       summary: Add dish to the collection and update restaurant dishes.
 *       parameters:
 *          - in: path
 *            name: restId
 *            required: true
 *            type: string
 *       responses:
 *         200:
 *           description: Returns a list of dishes.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Dish'
 *   /dishes/{dish_id}:
 *     get:
 *       tags:
 *         - Dishes
 *       summary: Get dish by id.
 *       parameters:
 *          - in: path
 *            name: dish_id
 *            required: true
 *            type: string
 *       responses:
 *         200:
 *           description: Returns a list of dishes.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Dish'
 *
 *   /dishes/{dish_id}/edit/restaurant/{restId}:
 *     patch:
 *       tags:
 *         - Dishes
 *       summary: Edit dish by id.
 *       parameters:
 *         - in: path
 *           name: dish_id
 *           required: true
 *           type: string
 *       responses:
 *          '204':
 *           description: Dish edited.
 * 
 *   /dishes/{dish_id}/restaurant/{restId}:
 *     patch:
 *       tags:
 *         - Dishes
 *       summary: Disable dish by id.
 *       parameters:
 *         - in: path
 *           name: dish_id
 *           required: true
 *           type: string
 *       responses:
 *          '204':
 *           description: Dish switched to inactive mode.
 */

// .dishes/
router.get(
  '/restaurant/:rest_id',
  validateObjectId,
  validateQuery(dishRequestJoiSchema),
  dishController.getAllDishes
);
router.post(
  '/restaurant/:rest_id',
  checkAuth(['admin']),
  validateObjectId,
  validateBody(dishJoiSchema),
  dishController.addDish
);
router.get('/:id', validateObjectId, dishController.getDishesById);
router.patch(
  '/:id/edit/restaurant/:rest_id',
  checkAuth(['admin']),
  validateObjectId,
  validateBody(dishJoiSchema),
  dishController.editDishById
);
router.patch(
  '/:id/restaurant/:rest_id',
  checkAuth(['admin']),
  validateObjectId,
  dishController.disableDishById
);

module.exports = router;
