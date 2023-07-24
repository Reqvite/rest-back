/**
 * @openapi
 * components:
 *   schemas:
 *     Personnel:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - password
 *         - restaurant_id
 *         - gender
 *         - phone
 *         - email
 *         - address
 *       properties:
 *         _id:
 *           type: string ( ObjectId )
 *           RegExp: /^[0-9a-fA-F]{24}$/
 *           description: The unique ID of the cook.
 *         name:
 *           type: string
 *           description: The name of the cook.
 *         password:
 *           type: integer
 *           description: The password for the cook's account.
 *         restaurant_id:
 *           type: integer
 *           description: The unique ID of the restaurant where the cook works.
 *         phone:
 *           type: string
 *           description: The phone number of the cook.
 *         email:
 *           type: string
 *           description: The email address of the cook.
 *         address:
 *           type: string
 *           description: The address of the cook.
 */
