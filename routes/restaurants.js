const express = require('express');
const router = express.Router();



/**
 * @openapi
 * /restaurant/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the restaurant.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The restaurant object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 */
router.get('/restaurant/:id', (req, res) => {
    res.status(200).send('Restaurant');
});

module.exports = router;
