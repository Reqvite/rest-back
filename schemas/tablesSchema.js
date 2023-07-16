/**
 * @openapi
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       required:
 *         - _id
 *         - status
 *         - seats
 *         - restaurant_id
 *       properties:
 *         _id:
 *           type: integer
 *           description: The unique ID of the table.
 *         status:
 *           type: string
 *           description: The current status of the table.
 *         seats:
 *           type: integer
 *           description: The number of seats at the table.
 *         restaurant_id:
 *           type: integer
 *           description: The unique ID of the restaurant where the table is located.
 */
