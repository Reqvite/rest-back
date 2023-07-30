const Dish = require('../models/dishModel')
const Restaurant = require('../models/restaurantModel')

const DishController = {
    getAllDishes: async (req,res)=>{
        const restaurantId = req.params.id;
        console.log(restaurantId)
        let dish;
        try{
            dish = await Restaurant.findById(restaurantId)
        }catch(e){
            if(!dish){
                return res.status(404).json({message:"No dish was found"})
            }
        }
        res.send('Dishes list by restaurant id:'+ dish.dishes_ids);
    },
    getDishesById: async (req,res)=>{
        const dishId = req.params.id;
        let dish;
        try{
            dish = await Dish.findById(dishId)
        }catch(e){
            if(!dish){
                return res.status(404).json({message:"No dish was found"})
            }
        }

        res.send(dish);
    },
    addDish: async (req,res,next)=>{
        let newDish;
        try{
            newDish = new Dish({
                name: req.body.name,
                ingridients: req.body.ingridients,
                picture: req.body.picture,
                type: req.body.type,
                spicy: req.body.spicy,
                vegetarian: req.body.vegetarian,
                pescatarian: req.body.pescatarian,
                portionWeight: req.body.portionWeight,
                price: req.body.price,
                updatedAt: req.body.updatedAt.toLocaleString(),
            })
            await newDish.save()
        }catch(e){
            console.log(e)
            if(!newDish){
                return res.status(500).json({message:"Unable to add"})
            }
        }

        res.send(newDish);
        next()
    },
    editDishById: async (req,res)=>{
        const dishId = req.params.id;
        let dish;
        try{
            dish = await Dish.findByIdAndUpdate(dishId, {
                name: req.body.name,
                ingridients: req.body.ingridients,
                picture: req.body.picture,
                type: req.body.type,
                spicy: req.body.spicy,
                vegetarian: req.body.vegetarian,
                pescatarian: req.body.pescatarian,
                portionWeight: req.body.portionWeight,
                price: req.body.price,
                updatedAt: req.body.updatedAt.toLocaleString(),
            })
            await dish.save()
        } catch(e){
            console.log(e)
            if(!dish){
                return res.status(404).json({message:"Unable to update by this id"})
            }
        }
        res.send('Dish id# is edited')
    },
    deleteDishById: async (req,res)=>{
        const dishId = req.params.id;
        let dish;
        try{
            dish = await Dish.findByIdAndRemove(dishId)
            await dish.save()
        } catch(e){
            console.log(e)
            if(!dish){
                return res.status(404).json({message:"Unable to delete by this id"})
            }
        }
        res.send(`Dish id ${dishId} is deleted`);
    },
}

module.exports = DishController;