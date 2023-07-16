/**
 * @openapi
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       required:
 *         - name
 *         - _id
 *         - dish_id
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the ingredient.
 *         _id:
 *           type: integer
 *           description: The unique ID of the ingredient.
 *         dish_id:
 *           type: integer
 *           description: The unique ID of the dish that includes the ingredient.
 *         type:
 *           type: string
 *           description: The type of the ingredient.
 */
