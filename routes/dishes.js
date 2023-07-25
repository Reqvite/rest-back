const express = require('express');
const router = express.Router();
const dishController = require ('../controllers/DishController')

router.get('/:rest_id', dishController.getAllDishes)
router.get('/dish/:id', dishController.getDishesById)

router.post('/dish/', dishController.addDish)

router.patch('/dish/:id', dishController.editDishById)

router.delete('/dish/:id', dishController.deleteDishById)

module.exports = router;