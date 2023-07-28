const express = require("express");
const IngredientsController = require("../controllers/IngredientsController");
const router = express.Router();

//Тимчасово поки не зроблять загальний ErrorHandler

const ctrlWrapper = (ctrl) => {
  return async (res, req, next) => {
    try {
      await ctrl(res, req, next);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * @openapi
 * paths:
 *   /ingredients:
 *     get:
 *       tags:
 *         - Ingredients
 *       summary: Get all ingredients
 *       responses:
 *         '200':
 *           description: The ingredients collection
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ingredient'
 */
router.get("/", ctrlWrapper(IngredientsController.getAllIngredients));

module.exports = router;
