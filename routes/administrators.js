const express = require('express');
const router = express.Router();




/**
 * @openapi
 * /administrator/{id}:
 *   get:
 *     summary: Get administrator by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the administrator.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The administrator object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrator'
 */
router.get('/administrator/:id', (req, res) => {
    res.status(200).send('Administrator');
});



module.exports = router;