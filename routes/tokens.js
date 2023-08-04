const express = require("express");
const tokenController = require("../controllers/TokenController");
const router = express.Router();
const { validateObjectId } = require('../middleware/validations');

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
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                   refreshToken:
 *                     type: string
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

router.get("/", tokenController.getUserToken);

module.exports = router;
