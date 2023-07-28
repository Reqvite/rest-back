/**
 * @openapi
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       required:
 *         - name
 *         - _id
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the ingredient.
 *         _id:
 *           type: string ( ObjectId )
 *           RegExp: /^[0-9a-fA-F]{24}$/
 *           description: The unique ID of the ingredient.
 *         type:
 *           type: string
 *           description: The type of the ingredient.
 */
