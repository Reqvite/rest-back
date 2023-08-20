const express = require('express');
const router = express.Router();
const { sse } = require('../controllers');
const { validateObjectId } = require('../middleware/validations');
const checkRestId = require('../middleware/checkRestId');

router.get('/:rest_id', validateObjectId, checkRestId, sse.connection);

module.exports = router;

/**
 * @openapi
 * paths:
 *   /sse/{rest_id}:
 *     get:
 *       tags:
 *         - SSE
 *       summary: Create real time update
 *       parameters:
 *         - in: path
 *           name: rest_id
 *           required: true
 *           type: string
 *           format: ObjectId
 *           example: 64c4fdea4055a7111092df32
 *       responses:
 *         '200':
 *           description: Set a connection
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     description: response status text
 *                     example: success
 *                   code:
 *                     type: integer
 *                     descriptio: response status code
 *                     example: 200
 *         '400':
 *           description: Bad request
 *         '404':
 *           description: Order not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 */
