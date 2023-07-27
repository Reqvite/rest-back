const express = require('express');
const router = express.Router();
const dishController = require ('../controllers/DishController')



/**
 * @openapi
 * paths:
 *   /{restaurantId}:
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
 *   /dish/{id}:
 *     post:
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



router.get('/:restaurantId', dishController.getAllDishes)
router.post('/dish/', dishController.addDish)

router.get('/dish/:id', dishController.getDishesById)
router.patch('/dish/:id', dishController.editDishById)
router.delete('/dish/:id', dishController.deleteDishById)





module.exports = router;
