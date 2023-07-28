const Ingredient = require("../models/ingredientModel");

const IngredientsController = {
  getAllIngredients: async (req, res) => {
    const result = await Ingredient.find();
    console.log(result);

    if (!result) {
      res.status(400);
      throw new Error("Bad Request");
    }

    res.status(200).json({
      code: 200,
      message: "success",
      result,
    });
  },
};

module.exports = IngredientsController;
