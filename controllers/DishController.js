const DishController = {
    getAllDishes: async (req,res)=>{
        const restaurantId = req.params;
        res.send('Dishes list by restaurant id:');
    },
    getDishesById: async (req,res)=>{
        const dishId = req.params;
        res.send('Dish:');
    },
    addDish: async (req,res)=>{
        res.send('Dish added:');
    },
    editDishById: async (req,res)=>{
        const dishId = req.params;
        res.send('Dish id# is edited');
    },
    deleteDishById: async (req,res)=>{
        const dishId = req.params;
        res.send('Dish id# is deleted');
    },
}

module.exports = DishController;