const { getSignedUrl } = require('../utils/s3');

const Dish = require('../models/dishModel');

const NotFoundError = require('../utils/errors/CustomErrors').NotFoundError;
const Restaurant = require('../models/restaurantModel');
require('dotenv').config();
const express = require('express');
const router = express.Router();

// Fetch all dishes by their IDs and populate ingredients
const fetchDishes = async (dishIdsArray) => {
  const fetchPromises = [];

  for (const dishId of dishIdsArray) {
    const fetchPromise = Dish.findById(dishId)
      .populate({ path: 'ingredients', model: 'Ingredient' })
      .exec() // Convert mongoose thenable to promise
      .then(async (dish) => {
        if (!dish) {
          console.log(`Dish not found for dish ID: ${dishId}`);
          return null; // Return null for non-existent dishes
        }
        dish.picture = await getSignedUrl(dish);
        return dish;
      })
      .catch((error) => {
        console.error(`Error fetching dish with ID ${dishId}:`, error);
        return null; // Return null for errors during fetching
      });

    fetchPromises.push(fetchPromise);
  }

  const fetchedDishes = await Promise.all(fetchPromises);
  return fetchedDishes.filter((dish) => dish !== null); // Remove null entries
};

router.post('/:id', async (req, res) => {
  try {
    const { ChatGPTAPI } = await import('chatgpt');
    const restaurantId = req.params.id;
    const { isVegan, likeSpicy, isPasc, wantHealthy } = req.body;
    const budget = parseInt(req.body.budget);

    if (isNaN(budget) || budget <= 0) {
      const err = new NotFoundError('Budget is too small!');
      return res.status(err.statusCode).json({ message: NotFoundError.message });
    }

    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: 'dishes_ids',
      select: 'name price type',
    });

    if (!restaurant) {
      const err = new NotFoundError('Restaurant with that ID is not found!');
      return res.status(err.statusCode).json({ message: NotFoundError.message });
    }

    const dishes = restaurant.dishes_ids;

    console.log('dishes', dishes);

    let prompt = `Hello, I want to eat in the restaurant and would like you to help me.
            I want to have a perfect meal. I will provide you with the data about the dishes 
            in the restaurant and my preferences as well as my budget. I want you to choose the dishes
             that can fell into my budget and satisfy my preferences. If there is no such an option, pls tell me that 
             with such a budget I can not have a meal in the restaurant. I will provide you the JSON objects
              of the menu: it will include the such fields: "name", "price", "type", "_id". 
              The price for every meal is shown in the price field in the menu. 
              And please use you intelligence to define dishes by their names. All the dishes 
             that will be present in menu are real dishes and you can find them in the internet or you must know 
             about them. Never give more than one dish of the same type.
            Here is an array of json objects of the menu of the restaurant I am going to eat in: ${dishes}. 
            It is very important for me to have a meal that will satisfy my preferences. Please
            take into account my preferences: `;

    if (isVegan) {
      prompt = `${prompt} I am vegan.`;
    }

    if (likeSpicy) {
      prompt = `${prompt} I want tp have a spicy food in my order.`;
    }

    if (isPasc) {
      prompt = `${prompt} I am pascatarian.`;
    }

    if (wantHealthy) {
      prompt = `${prompt} I want to eat healthy food choose only dishes you consider as healthy.`;
    }

    prompt = `${prompt} My budget is ${budget}$. The sum of the dishes' cost MUST be below the budget. You MUSTNT 
        go over the budget. If there is an option when only one dish can fit my budget, 
        pls give me this option. Don't give too much dishes, select up to 4
        (maximum 4 but can be less if you consider that it will be enough for me) dishes from the menu that would
        make a perfect meal for 1 person! The best setup would be some salad, some main dish, a dessert and some drink. 
        Of course, you can add some other dishes if you consider that it will be better.
        In your response, can you pls add break lines between paragraphs.
        Help me to choose the dishes. I want the response to look in specific way. There should be 2 paragraphs. 
        In the first, there should be your advices and the text that you consider as important. You should tell me 
        the best set of dishes and your other comments. The second, I want it to start with the word "LIST_OF_DISHES"
        and then there should be an array of dishes _ids. Please, do not
        write ANY other text in the second paragraph. I want to have only the word "LIST_OF_DISHES" and the array of
        dishes _ids. All the text and suggestions should be in the first paragraph. The previous sentance should end 
        with a dot. The second paragraph should start with the word
        "LIST_OF_DISHES" and after the array of dishes _ids. Please no more words before or after it. Please remove all
        the "\n" symbols from the text. I want to have only one "\n" symbol between the paragraphs. Also, put only 
        _id symbols without the word "ObjectId" before them. I want to have only the _id symbols. 
        The example: [ "64d9ced6ec2a03efaaad15b0", "64da0f174574e1e22e9c0a5d" ].`;

    console.log('prompt', prompt);

    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY || '',
      maxResponseTokens: 400,
    });
    const response = await api.sendMessage(prompt);

    let responseText = response.text;

    // Find the index of the occurrence of "LIST_OF_DISHES"
    const index = responseText.indexOf('LIST_OF_DISHES');

    // Extract the text before the occurrence
    const textBefore = responseText.substring(0, index);

    responseText = responseText.replace(/\n/g, '');

    // Regular expression to match an array of IDs
    const regex = /\[(.*?)\]/;

    // Extract the matched array using RegExp
    const match = responseText.match(regex);

    if (match) {
      const arrayOfIDs = JSON.parse('[' + match[1] + ']');
      const dishes = await fetchDishes(arrayOfIDs);
      res.status(200).json({ textBefore, dishes });
    } else {
      console.log('No array of IDs found.');
      res.status(200).json({ textBefore, dishes: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
