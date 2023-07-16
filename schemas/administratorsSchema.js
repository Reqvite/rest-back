/**
 * @openapi
 * components:
 *   schemas:
 *     Administrator:
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
 *           type: integer
 *           description: The unique ID of the administrator.
 *         name:
 *           type: string
 *           description: The name of the administrator.
 *         password:
 *           type: integer
 *           description: The password for the administrator's account.
 *         restaurant_id:
 *           type: integer
 *           description: The unique ID of the restaurant that the administrator manages.
 *         gender:
 *           type: string
 *           description: The gender of the administrator.
 *         phone:
 *           type: string
 *           description: The phone number of the administrator.
 *         email:
 *           type: string
 *           description: The email address of the administrator.
 *         address:
 *           type: string
 *           description: The address of the administrator.
 */