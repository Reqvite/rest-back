const express = require('express');
const ingredientsController = require('../controllers/IngredientsController');
const router = express.Router();

/**
 * @openapi
 * paths:
 *   /:
 *     get:
 *       summary: Get all ingredients
 *       responses:
 *         200:
 *           description: The ingredients collection
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Ingredient'
 *                 type: array
 *                 items:
 *                   type: string
 */
router.get('/', ingredientsController.getAllIngredients);

module.exports = router;
