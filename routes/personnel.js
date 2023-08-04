const express = require('express');
const personnelController = require('../controllers/PersonnelController');
const router = express.Router();
const {
  personnelJoiSchema,
  personnelJoiSchemaDelete,
} = require('../middleware/joiSchemas/personnelJoiSchemas');
const { validateBody, validateObjectId } = require('../middleware/validations');

/**
 * @openapi
 * paths:
 *   /personnel/restaurant/{restaurantId}:
 *     get:
 *       tags:
 *         - Personnel
 *       summary: Get all personnel by restaurant
 *       parameters:
 *         - in: path
 *           name: restaurantId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A list of personnel
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Personnel'
 *
 *   /personnel:
 *     post:
 *       tags:
 *         - Personnel
 *       summary: Add new personnel
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personnel'
 *       responses:
 *         '201':
 *           description: Personnel added
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Personnel'
 *         '400':
 *           description: Bad Request - Missing required fields or invalid data
 *         '500':
 *           description: Internal Server Error - Something went wrong on the server
 *
 *   /personnel/{personnelId}:
 *     get:
 *       tags:
 *         - Personnel
 *       summary: Get personnel by id
 *       parameters:
 *         - in: path
 *           name: personnelId
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: A single personnel
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Personnel'
 *         '404':
 *           description: Personnel not found
 *         '500':
 *           description: Internal Server Error - Something went wrong on the server
 *
 *     patch:
 *       tags:
 *         - Personnel
 *       summary: Update personnel
 *       parameters:
 *         - in: path
 *           name: personnelId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personnel'
 *       responses:
 *         '200':
 *           description: Personnel updated
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Personnel'
 *         '204':
 *           description: No content
 *         '401':
 *           description: Unauthorized - The provided restaurant_id does not match the personnel's restaurant_id
 *         '404':
 *           description: Personnel not found
 *         '500':
 *           description: Internal Server Error - Something went wrong on the server
 *
 *     delete:
 *       tags:
 *         - Personnel
 *       summary: Delete personnel
 *       parameters:
 *         - in: path
 *           name: personnelId
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restaurant_id:
 *                   type: string
 *               required:
 *                 - restaurant_id
 *       responses:
 *         '200':
 *           description: Personnel deleted successfully
 *         '401':
 *           description: Unauthorized - The provided restaurant_id does not match the personnel's restaurant_id
 *         '404':
 *           description: Personnel not found
 *         '500':
 *           description: Internal Server Error - Something went wrong on the server
 */

router.get('/restaurant/:id', validateObjectId, personnelController.getPersonnelByRestaurantId);
router.get('/:id', validateObjectId, personnelController.getPersonnelById);
router.post('/', validateBody(personnelJoiSchema), personnelController.addPersonnel);
router.patch(
  '/:id',
  validateObjectId,
  validateBody(personnelJoiSchema),
  personnelController.updatePersonnel
);
router.delete(
  '/:id',
  validateObjectId,
  validateBody(personnelJoiSchemaDelete),
  personnelController.deletePersonnel
);

module.exports = router;
