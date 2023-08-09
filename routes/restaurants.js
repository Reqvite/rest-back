const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/RestaurantsController');
const { validateObjectId } = require('../middleware/validations');

/**
 * @openapi
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant by id
 *     tags:
 *       - Restaurants
 *     operationId: getRestaurantById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The id of the restaurant.
 *         schema:
 *           type: string (ObjectId)
 *     responses:
 *       200:
 *         description: The restaurant object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.get('/:id', validateObjectId, restaurantsController.getRestaurantById);
router.get('/:id/statistics', validateObjectId, restaurantsController.getStatisticsByRestuarantId);
module.exports = router;
