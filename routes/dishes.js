const express = require('express');
const router = express.Router();
const dishController = require('../controllers/DishController');
const { validateBody, validateQuery, validateObjectId } = require('../middleware/validations');
const { dishJoiSchema, dishRequestJoiSchema } = require('../middleware/joiSchemas/dishJoiSchemas');

/**
 * @openapi
 * paths:
 *   /dishes/restaurant/{id}:
 *     get:
 *       tags:
 *         - Dishes
 *       summary: Get all dishes by restaurant id.
 *       parameters:
 *          - in: path
 *            name: Id
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
 *   /dishes/restaurant/{Id}:
 *     post:
 *       tags:
 *         - Dishes
 *       summary: Add dish to the collection and update restaurant dishes.
 *       parameters:
 *          - in: path
 *            name: restaurant_id
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
 *   /dishes/{id}:
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
 *
 *   /dishes/{id}/restaurant/{Id}:
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
  '/restaurant/:id',
  validateObjectId,
  validateQuery(dishRequestJoiSchema),
  dishController.getAllDishes
);
router.post(
  '/restaurant/:id',
  validateObjectId,
  validateBody(dishJoiSchema),
  dishController.addDish
);
router.get('/:id', validateObjectId, dishController.getDishesById);
router.patch('/:id', validateObjectId, validateBody(dishJoiSchema), dishController.editDishById);
router.patch('/:id/restaurant/:rest_id', validateObjectId, dishController.disableDishById);

module.exports = router;
