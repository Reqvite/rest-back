const express = require('express');
const router = express.Router();
const dishController = require ('../controllers/DishController')

router.get('/:rest_id', dishController.getAllDishes)
router.get('/:id', dishController.getDishesById)

router.post('/', dishController.addDish)

router.patch('/:id', dishController.editDishById)

router.delete('/:id', dishController.deleteDishById)

module.exports = router;