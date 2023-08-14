const express = require('express');
const router = express.Router();
const restaurantsController = require('../controllers/RestaurantsController');
const { validateObjectId } = require('../middleware/validations');

/**
 * @openapi
 * /restaurants/{rest_id}:
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
router.get(
  '/:rest_id/statistics',
  validateObjectId,
  restaurantsController.getStatisticsByRestuarantId
);
router.get('/:rest_id', validateObjectId, restaurantsController.getRestaurantById);

module.exports = router;
