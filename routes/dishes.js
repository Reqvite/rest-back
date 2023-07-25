const express = require('express');
const router = express.Router();
const dishController = require ('../controllers/DishController')

router.get('/dishes/:rest_id', dishController.getAllDishes)
router.get('/dishes/:id', dishController.getDishesById)

router.post('/dishes/', dishController.addDish)

router.patch('/dishes/:id', dishController.editDishById)

router.delete('/dishes/:id', dishController.deleteDishById)

module.exports = router;