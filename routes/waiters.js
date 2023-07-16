const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /waiter/{id}:
 *   get:
 *     summary: Get waiter by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the waiter.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The waiter object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Waiter'
 */
router.get('/waiter/:id', (req, res) => {
    res.status(200).send('Waiter')
});



module.exports = router;