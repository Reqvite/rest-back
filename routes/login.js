const express = require("express");
const loginController = require("../controllers/LoginController");
const router = express.Router();

/**
 * @openapi
 * paths:
 *   /login:
 *     post:
 *       tags:
 *         - Login
 *       summary: User login
 *       description: Authenticate user and get access tokens
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         200:
 *           description: Successfully authenticated
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                   token:
 *                     type: string
 *                   refreshToken:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   name:
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

router.post("/", loginController.loginUser);

module.exports = router;
