const NotFoundError = require("../utils/errors/CustomErrors").NotFoundError;
const Restaurant = require("../models/restaurantModel");
const Ingredient = require("../models/restaurantModel");

require("dotenv").config();
const express = require("express");
const router = express.Router();

router.post("/:id", async (req, res) => {
    try {
        const {ChatGPTAPI} = await import('chatgpt');
        const restaurantId = req.params.id;
        const {isVegan, likeSpicy, isPasc, wantHealthy, wantDrink} = req.body;
        const budget = parseInt(req.body.budget);

        if (budget < 6) {
            const err = new NotFoundError('Budget is too small!');
            return res.status(err.statusCode).json({message: NotFoundError.message});
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            const err = new NotFoundError('Restaurant with that ID is not found!');
            return res.status(err.statusCode).json({message: NotFoundError.message});
        }

        const restaurants = await Restaurant.findById(restaurantId).populate({
            path: 'dishes_ids',
            select: 'name picture portionWeight price ingredients type isActive',
            populate: {
                path: 'ingredients',
                model: Ingredient,
                select: 'name',
            },
        });

        const dishes = restaurants.dishes_ids;

        let prompt = `Hello, I want to eat in the restaurant and would like you to help me.
            I want to have a perfect meal. I will provide you with the data about the dishes 
            in the restaurant and my preferences as well as my budget. I want you to choose the dishes
             that can fell into my budget and satisfy my preferences. If there is no such an option, pls tell me that 
             with such a budget I can not have a perfect meal in the restaurant. The price for every meal is shown in the 
             price field in the menu.
            Here is an array of json objects of the menu of the restaurant I am going to eat in: ${dishes}.`;

        if (isVegan) {
            prompt = `${prompt} I am vegan.`
        }

        if (likeSpicy) {
            prompt = `${prompt} I like spicy food.`
        }

        if (isPasc) {
            prompt = `${prompt} I am pascatarian.`
        }

        if (wantHealthy) {
            prompt = `${prompt} I want to eat healthy food choose only dishes you consider as healthy.`
        }

        if (wantDrink) {
            prompt = `${prompt} I want you to add a drink into my order.`
        }

        prompt = `${prompt} My budget is ${budget}$. Also, if there is an option when only one dish can fit my budget, 
        pls give me this option. In your response, can you pls add break lines between paragraphs. Help me to choose the dishes.`;

        console.log(prompt);

        const api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
            maxResponseTokens: 400,

        });
        const response = await api.sendMessage(prompt);
        res.status(200).json({message: "Success", response});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong"});
    }
});

module.exports = router;