/**
 * @openapi
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       required:
 *         - _id
 *         - table_number
 *         - status
 *         - seats
 *         - restaurant_id
 *       properties:
 *         _id:
 *           type: string ( ObjectId )
 *           RegExp: /^[0-9a-fA-F]{24}$/
 *           description: The unique ID of the table.
 *         table_number:
 *           type: number
 *           description: The number of the table.
 *         status:
 *           type: string
 *           description: The current status of the table.
 *         seats:
 *           type: integer
 *           description: The number of seats at the table.
 *         restaurant_id:
 *           type: string ( ObjectId )
 *           description: The unique ID of the restaurant where the table is located.
 */
