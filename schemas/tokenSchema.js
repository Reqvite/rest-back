/**
 * @openapi
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: The unique ID of the token.
 *         user_id:
 *           type: string
 *           format: objectId
 *           description: The unique ID of the token holder.
 *         token_id:
 *           type: string
 *         token:
 *           type: string
 *         refreshToken:
 *           type: string
 *         restaurant_id:
 *           type: string
 *           format: objectId
 *           description: The unique ID of the restaurant where the person works.
 *         role:
 *           type: string
 *           enum: ['admin', 'cook', 'waiter']
 *           description: Administrator/Cook/Waiter.
 *       example:
 *         _id: "615f437d00bfc42dd4d7fdd0"
 *         user_id: "615f437d00bfc42dd4d7fdd1"
 *         token_id: "e6f2ab2f-aa8f-4e03-9b81-87b2b27ad9b8"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzU2ZTBlYzBhNjc4ZGZkYzgyZTc5OSIsInRva2VuX2lkIjoiNDI4MDE..."
 *         refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         restaurant_id: "615f437d00bfc42dd4d7fdd2"
 *         role: "admin"
 */
