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
 *         - role
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
 *           type: string
 *           description: The password for the personnel's account (crypted).
 *         restaurant_id:
 *           type: string ( ObjectId )
 *           RegExp: /^[0-9a-fA-F]{24}$/
 *           description: The unique ID of the restaurant where the person works.
 *         gender:
 *           type: string
 *           description: The gender of the person.
 *         role:
 *           type: string
 *           description: Administrator/Cook/Waiter.
 *         phone:
 *           type: string
 *           description: The phone number of the person.
 *         email:
 *           type: string
 *           description: The email address of the person.
 *         address:
 *           type: string
 *           description: The address of the person.
 *         picture:
 *           type: string
 *           description: The picture of the person (just a name in the s3 bucket).
 */
