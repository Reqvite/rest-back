const express = require('express');
const tokenController = require('../controllers/TokenController');
const { validateObjectId } = require('../middleware/validations');
const router = express.Router();

/**
 * @openapi
 * paths:
 *   /tokens:
 *     get:
 *       tags:
 *         - Tokens
 *       summary: Refresh user tokens
 *       description: Refresh access and refresh tokens for a user
 *       responses:
 *         200:
 *           description: Tokens refreshed successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Token'
 *         500:
 *           description: Something went wrong
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 */

router.get('/:id', validateObjectId, tokenController.getUserToken);

module.exports = router;
