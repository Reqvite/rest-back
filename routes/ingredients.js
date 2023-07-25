const express = require('express');
const ingredientsController = require('../controllers/IngredientsController');
const router = express.Router();

/**
 * @openapi
 * paths:
 *   /ingredients:
 *     get:
 *       summary: Get all ingredients
 *       responses:
 *         200:
 *           description: The ingredients collection
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Ingredient'
 */
router.get('/', ingredientsController.getAllIngredients);

module.exports = router;
