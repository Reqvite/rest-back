const express = require('express');
const loginController = require('../controllers/LoginController');
const router = express.Router();
const { loginJoiSchema } = require('../middleware/joiSchemas/loginJoiSchemas');
const { validateBody } = require('../middleware/validations');

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
 *                   example: john@example.com
 *                 password:
 *                   type: string
 *                   example: mysecretpassword
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
 *                     example: Authenticated
 *                   token:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   refreshToken:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                   userId:
 *                     type: string
 *                     example: "615f437d00bfc42dd4d7fdd0"
 *                   restaurantId:
 *                     type: string
 *                     example: "615f437d00bfc42dd4d7fdd0"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   role:
 *                     type: string
 *                     enum: ['admin', 'cook', 'waiter']
 *                     example: "admin"
 *         500:
 *           description: Something went wrong
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Internal server error. Please try again later."
 */

router.post('/', validateBody(loginJoiSchema), loginController.loginUser);

module.exports = router;
