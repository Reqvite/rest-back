const express = require('express');
const router = express.Router();
const { tables } = require('../controllers');
const { updateTableJoiSchema } = require('../middleware/joiSchemas/tableJoiSchemas');
const { validateObjectId, validateBody } = require('../middleware/validations');

/**
 * @openapi
 * paths:
 *   /restaurant/{restaurantId}:
 *     get:
 *       tags:
 *         - Tables
 *       summary: Get all tables by restaurant
 *       parameters:
 *         - name: restaurantId
 *           in: path
 *           required: true
 *           example: 64c4fdea4055a7111092df32
 *           description: The ID of the restaurant.
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A list of tables
 *           content:
 *             application/json:
 *               schema:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fe004055a7111092df34
 *                         number:
 *                           type: number
 *                           example: 1
 *                         restaurant_id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         status:
 *                           type: string
 *                           enum:
 *                             - Taken
 *                             - Free
 *                             - Waiting
 *                           default: Free
 *                           example: Free
 *                         seats:
 *                           type: number
 *                           example: 2
 *         '400':
 *           description: Bad request
 *         '404':
 *           description: Restaurant not found
 *         '500':
 *           description: Internal server error
 *
 *   /{tableId}/restaurant/{restaurantId}:
 *     get:
 *       tags:
 *         - Tables
 *       summary: Get table by id
 *       parameters:
 *         - in: path
 *           name: restaurantId
 *           required: true
 *           type: string
 *           example: 64c4fdea4055a7111092df32
 *         - in: path
 *           name: tableId
 *           required: true
 *           type: string
 *           example: 64c4fe004055a7111092df34
 *       responses:
 *         '200':
 *           description: A list of tables
 *           content:
 *             application/json:
 *               schema:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fe004055a7111092df34
 *                         number:
 *                           type: number
 *                           example: 1
 *                         restaurant_id:
 *                           type: string
 *                           format: ObjectId
 *                           example: 64c4fdea4055a7111092df32
 *                         status:
 *                           type: string
 *                           enum:
 *                             - Taken
 *                             - Free
 *                             - Waiting
 *                           default: Free
 *                           example: Free
 *                         seats:
 *                           type: number
 *                           example: 2
 *         '400':
 *           description: Bad request
 *         '404':
 *           description: Table not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 *   /{tableId}:
 *     patch:
 *       tags:
 *         - Tables
 *       summary: Update table
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum:
 *                     - Taken
 *                     - Free
 *                     - Waiting
 *                   example: Waiting
 *                 restaurant_id:
 *                   type: string
 *                   example: 64c4fdea4055a7111092df32
 *               required:
 *                 - status
 *                 - restaurant_id
 *       parameters:
 *         - in: path
 *           name: tableId
 *           required: true
 *           type: string
 *           example: 64c4fe004055a7111092df34
 *       responses:
 *         '200':
 *           description: Table updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   updatedTable:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         format: ObjectId
 *                         example: 64c4fe004055a7111092df34
 *                       table_number:
 *                         type: number
 *                         example: 1
 *                       restaurant_id:
 *                         type: string
 *                         format: ObjectId
 *                         example: 64c4fdea4055a7111092df32
 *                       status:
 *                         type: string
 *                         enum:
 *                           - Taken
 *                           - Free
 *                           - Waiting
 *                         example: Waiting
 *                       seats:
 *                         type: number
 *                         example: 2
 *         '400':
 *           description: Bad request (Invalid request body)
 *         '401':
 *           description: Anauthorized
 *         '404':
 *           description: Table not found or Restaurant not found
 *         '500':
 *           description: Internal server error
 */

// const ctrlWrapper = (ctrl) => {
//   return async (req, res, next) => {
//     try {
//       await ctrl(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   };
// };

router.get('/restaurant/:rest_id', validateObjectId, tables.getTablesByRestaurantId);
router.get('/:id/restaurant/:rest_id', validateObjectId, tables.getTable);
router.patch('/:id', validateObjectId, validateBody(updateTableJoiSchema), tables.updateTable);

module.exports = router;
