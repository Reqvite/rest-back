const express = require('express');
const router = express.Router();
const dishController = require ('../controllers/DishController')

/*
  @openapi
  paths:
   /restaurant/{id}:
    get:
      summary: Get all dishes connected to selected restaurant
       parameters:
          - in: path
           name: rest_id
           required: true
           type: string
      responses:
        '200':
          description: Returns a list of dishes.
           content:
              application/json:
                schema:
                  type: array
                  items:
                    $ref: '#/components/schemas/Dish'
  /dish/:                  
   post:
      summary: Add a new dish.
      requestBody:
         required: true
         content:
           application/json:
              schema:
                $ref: '#/components/schemas/Personnel'
      responses:
        '201':
         description: Add dish. 


  /dish/{id}:
    get:
      summary: Get exact dish.
      parameters:
          - in: path
           name: dish_id
           required: true
           type: string
      responses:
        '200':
          description: Returns an exact dish.
           content:
              application/json:
                schema:
                  type: array
                  items:
                    $ref: '#/components/schemas/Dish'

    patch:
      summary: Edit a dish by id.
      parameters:
          - in: path
           name: dish_id
           required: true
           type: string
      responses:
        '204':
         description: Dish edited.

    delete:
      summary: Delete a dish by id.
      parameters:
          - in: path
           name: dish_id
           required: true
           type: string
      responses:
        '204':
         description: Dish deleted.
 */

router.get('/restaurant/:id', dishController.getAllDishes)
router.post('/dish/', dishController.addDish)

router.get('/dish/:id', dishController.getDishesById)
router.patch('/dish/:id', dishController.editDishById)
router.delete('/dish/:id', dishController.deleteDishById)





module.exports = router;