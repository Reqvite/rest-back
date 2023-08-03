const express = require('express');
const router = express.Router();
const dishController = require('../controllers/DishController');
const { validateBody, validateObjectId } = require('../utils/validation/additionalValidation');
const { dishJoiSchema } = require('../utils/validation/joiSchemas/dishJoiSchemas');

/**
 * @openapi
 * paths:
 *   /dishes/restaurant/{id}:
 *     get:
 *       tags:
 *         - Dishes
 *       summary: Get all dishes by restaurant id.
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
 *     delete:
 *       tags:
 *         - Dishes
 *       summary: Delete dish by id.
 *       parameters:
 *         - in: path
 *           name: dish_id
 *           required: true
 *           type: string
 *       responses:
 *          '204':
 *           description: Dish deleted.
 */

// .dishes/
router.get('/restaurant/:id', validateObjectId, dishController.getAllDishes);
router.post(
  '/restaurant/:id',
  validateObjectId,
  validateBody(dishJoiSchema),
  dishController.addDish
);
router.get('/:id', validateObjectId, dishController.getDishesById);
router.patch('/:id', validateObjectId, validateBody(dishJoiSchema), dishController.editDishById);
router.delete('/:id/restaurant/:rest_id', validateObjectId, dishController.deleteDishById);

module.exports = router;
