const express = require('express');
const IngredientsController = require('../controllers/IngredientsController');
const router = express.Router();

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
router.get('/', IngredientsController.getAllIngredients);

module.exports = router;
