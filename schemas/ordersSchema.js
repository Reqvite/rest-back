/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - _id
 *         - status
 *         - table_id
 *       properties:
 *         _id:
 *           type: string ( ObjectId )
 *           RegExp: /^[0-9a-fA-F]{24}$/
 *           description: The unique ID of the order.
 *         status:
 *           type: string
 *           description: The current status of the order.
 *         table_id:
 *           type: integer
 *           description: The unique ID of the table where the order was placed.
 */
