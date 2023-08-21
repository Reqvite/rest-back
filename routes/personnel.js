const express = require('express');
const personnelController = require('../controllers/PersonnelController');
const router = express.Router();
const {
  personnelJoiSchema,
  personnelJoiSchemaDelete,
  personnelJoiSchemaPatch,
  personnelRequestJoiSchema,
} = require('../middleware/joiSchemas/personnelJoiSchemas');
const { validateBody, validateObjectId, validateQuery } = require('../middleware/validations');
const checkAuth = require('../middleware/authorization/checkAuth');

router.get(
    '/restaurant/:rest_id',
    checkAuth(['admin']),
    validateObjectId,
    personnelController.getPersonnelByRestaurantId
);
router.get(
    '/:id/restaurant/:rest_id',
    checkAuth(['admin']),
    validateObjectId,
    personnelController.getPersonnelById
);
router.post(
    '/',
    validateBody(personnelJoiSchema),
    checkAuth(['admin']),
    personnelController.addPersonnel
);
router.patch(
    '/:id',
    validateBody(personnelJoiSchemaPatch),
    checkAuth(['admin']),
    validateObjectId,
    personnelController.updatePersonnel
);
router.delete(
    '/:id',
    validateBody(personnelJoiSchemaDelete),
    checkAuth(['admin']),
    validateObjectId,
    personnelController.deletePersonnel
);

/**
 * @openapi
 * paths:
 *   /personnel/restaurant/{rest_id}:
 *     get:
 *       tags:
 *         - Personnel
 *       summary: Get all personnel by restaurant
 *       parameters:
 *         - in: path
 *           name: rest_id
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
 *   /personnel/{id}/restaurant/{rest_id}:
 *     get:
 *       tags:
 *         - Personnel
 *       summary: Get personnel by id
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *         - in: path
 *           name: rest_id
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
 *               $ref: '#/components/schemas/PersonnelInput'
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
 *   /personnel/{id}:
 *     patch:
 *       tags:
 *         - Personnel
 *       summary: Update personnel
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PersonnelInput'
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
 *           name: id
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
 *
 * components:
 *   schemas:
 *     Personnel:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *         role:
 *           type: string
 *         restaurant_id:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         picture:
 *           type: string
 *       required:
 *         - _id
 *         - name
 *         - gender
 *         - role
 *         - restaurant_id
 *         - phone
 *         - email
 *         - address
 *
 *     PersonnelInput:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         gender:
 *           type: string
 *         role:
 *           type: string
 *         restaurant_id:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         address:
 *           type: string
 *         picture:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - firstName
 *         - lastName
 *         - gender
 *         - role
 *         - restaurant_id
 *         - phone
 *         - email
 *         - address
 */

router.get(
  '/restaurant/:rest_id',
  checkAuth(['admin']),
  validateObjectId,
  validateQuery(personnelRequestJoiSchema),
  personnelController.getPersonnelByRestaurantId
);
router.get(
  '/:id/restaurant/:rest_id',
  checkAuth(['admin']),
  validateObjectId,
  personnelController.getPersonnelById
);
router.post(
  '/',
  validateBody(personnelJoiSchema),
  checkAuth(['admin']),
  personnelController.addPersonnel
);
router.patch(
  '/:id',
  validateBody(personnelJoiSchemaPatch),
  checkAuth(['admin']),
  validateObjectId,
  personnelController.updatePersonnel
);
router.delete(
  '/:id',
  validateBody(personnelJoiSchemaDelete),
  checkAuth(['admin']),
  validateObjectId,
  personnelController.deletePersonnel
);

module.exports = router;
