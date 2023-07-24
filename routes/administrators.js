const express = require("express");
const administratorsController = require("../controllers/AdministratorsController");
const router = express.Router();

/**
 * @openapi
 * paths:
 *   /personnel/restaurant/{restaurantId}:
 *     get:
 *       tags:
 *         - Administrators
 *       summary: Get all personnel by restaurant
 *       parameters:
 *         - in: path
 *           name: restaurantId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: A list of personnel
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Personnel'
 *   /personnel:
 *     post:
 *       tags:
 *         - Administrators
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
 *
 *   /personnel/{personnelId}:
 *     get:
 *       tags:
 *         - Administrators
 *       summary: Get personnel by id
 *       parameters:
 *         - in: path
 *           name: personnelId
 *           required: true
 *           type: string
 *       responses:
 *         '200':
 *           description: A single personnel
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Personnel'
 *
 *     patch:
 *       tags:
 *         - Administrators
 *       summary: Update personnel
 *       parameters:
 *         - in: path
 *           name: personnelId
 *           required: true
 *           type: string
 *       responses:
 *         '204':
 *           description: No content
 *           schema:
 *             $ref: '#/components/schemas/Personnel'
 *
 *     delete:
 *       tags:
 *         - Administrators
 *       summary: Delete personnel
 *       parameters:
 *         - in: path
 *           name: personnelId
 *           required: true
 *           type: string
 *       responses:
 *         '204':
 *           description: No content
 */

router.get(
  "/personnel/restaurant/:id",
  administratorsController.getPersonnelByRestaurantId
);
router.get("/personnel/:id", administratorsController.getPersonnel);
router.post("/personnel", administratorsController.addPersonnel);
router.patch("/personnel/:id", administratorsController.updatePersonnel);
router.delete("/personnel/:id", administratorsController.deletePersonnel);

module.exports = router;
