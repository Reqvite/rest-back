
//this is a file with a route to check if the server is running properly


const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     description: Check the health of the server
 *     responses:
 *       200:
 *         description: The server is running properly
 *       502:
 *         description: The server is not running properly
 */
router.get('/', (req, res) => {
    res.status(200).send('Server is running properly');
});

module.exports = router;
