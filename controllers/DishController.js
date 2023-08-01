const Dish = require('../models/dishModel')
const Restaurant = require('../models/restaurantModel')
const Ingredient = require('../models/ingredientModel');

const DishController = {
     // request example GET /dishes/restaurant/64c63ab344d6a7657d7a49d5?type=Burgers
    getAllDishes: async (req,res)=>{
        const restaurantId = req.params.id;
        const { type } = req.query;
    
        let dish;

        try{
            dish = await Restaurant.findById(restaurantId).populate({
                path: 'dishes_ids',
                select: 'name picture portionWeight price ingredients',
                match: { type: type },
                populate: {
                  path: 'ingredients',
                  model: Ingredient,
                  select: 'name'
                },
            })

        }catch(e){
            if(!dish){
                return res.status(404).json({message:"No dish was found"})
            }
        }
        res.send(dish);
    },


    getDishesById: async (req,res)=>{
        const dishId = req.params.id;
        let dish;
        try{
            dish = await Dish.findById(dishId).populate({ path: 'ingredients', model: 'Ingredient' });
        }catch(e){
            if(!dish){
                return res.status(404).json({message:"No dish was found"})
            }
        }
        res.send(dish);
    },


    addDish: async (req,res)=>{
        let newDish 
        const restaurantId =  req.params.id
        try{
            newDish = new Dish({
                name: req.body.name,
                ingredients: req.body.ingredients,
                picture: req.body.picture,
                type: req.body.type,
                spicy: req.body.spicy,
                vegetarian: req.body.vegetarian,
                pescatarian: req.body.pescatarian,
                portionWeight: req.body.portionWeight,
                price: req.body.price,
                updatedAt: req.body.updatedAt.toLocaleString(),
            })
           const savedDish = await newDish.save()
           
            await Restaurant.findByIdAndUpdate(restaurantId, { $push: { dishes_ids: savedDish._id } });
        }catch(e){
            console.log(e)
            if(!newDish){
                return res.status(500).json({message:"Unable to add"})
            }
        }
        res.send(newDish);
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
        const restaurantId = req.params.rest_id;
        let dish;
        try{
            const updatedRestaurant = await Restaurant.findByIdAndUpdate(
                restaurantId,
                { $pull: { dishes_ids: dishId } },
                { new: true }
            );
            dish = await Dish.findByIdAndRemove(dishId)
        } catch(e){
            console.log(e)
        }
        res.send('Dish id# is deleted');
    },
}

module.exports = DishController;
