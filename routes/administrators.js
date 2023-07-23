const express = require("express");
const administratorsController = require("../controllers/AdministratorsController");
const router = express.Router();

/**
 * @openapi
 * paths:
 *   /administrators/dishes:
 *     get:
 *       tags:
 *         - Administrators
 *       summary: Get all dishes
 *       responses:
 *         '200':
 *           description: A list of dishes
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Dish'
 *     post:
 *       tags:
 *         - Administrators
 *       summary: Add new dish to the menu
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *       responses:
 *         '201':
 *           description: Dish added
 *
 *   /dishes/{dishId}:
 *     patch:
 *       tags:
 *         - Administrators
 *       summary: Update dish
 *       parameters:
 *         - in: path
 *           name: dishId
 *           required: true
 *           type: string
 *       responses:
 *         '204':
 *           description: No content
 *           schema:
 *             $ref: '#/definitions/Transaction'
 *     delete:
 *       tags:
 *         - Administrators
 *       summary: Delete dish
 *       parameters:
 *         - in: path
 *           name: dishid
 *           required: true
 *           type: string
 *       responses:
 *         '204':
 *           description: Dish deleted
 *
 *   /administrators/personnel:
 *     get:
 *       tags:
 *         - Administrators
 *       summary: Get all personnel
 *       responses:
 *         '200':
 *           description: A list of personnel
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Personnel'
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
 *     delete:
 *       tags:
 *         - Administrators
 *       summary: Delete personnel
 *       parameters:
 *         - in: path
 *           name: personnelid
 *           required: true
 *           type: string
 *       responses:
 *         '204':
 *           description: No content
 *
 */

router.get("/dishes", administratorsController.getDishes);
router.post("/dishes", administratorsController.addDish);
router.patch("/dishes/:id", administratorsController.updateDish);
router.delete("/dishes/:id", administratorsController.deleteDish);
router.get("/personnel", administratorsController.getPersonnel);
router.post("/personnel", administratorsController.addPersonnel);
router.patch("/personnel/:id", administratorsController.updatePersonnel);
router.delete("/personnel/:id", administratorsController.deletePersonnel);

module.exports = router;
