/**
 * @openapi
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - name
 *         - _id
 *         - order_id
 *         - picture
 *         - type
 *         - spicy
 *         - vegetarian
 *         - portion_weight
 *         - price
 *         - quantity
 *         - isActive
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the dish.
 *         _id:
 *           type: string ( ObjectId )
 *           RegExp: /^[0-9a-fA-F]{24}$/
 *           description: The unique ID of the dish.
 *         order_id:
 *           type: integer
 *           description: The unique ID of the order that includes the dish.
 *         picture:
 *           type: string
 *           description: A URL pointing to the picture of the dish.
 *         type:
 *           type: string
 *           description: The type of the dish.
 *         spicy:
 *           type: boolean
 *           description: Whether the dish is spicy or not.
 *         vegetarian:
 *           type: boolean
 *           description: Whether the dish is vegetarian or not.
 *         portion_weight:
 *           type: number
 *           format: float
 *           description: The weight of one portion of the dish.
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the dish.
 *         quantity:
 *           type: integer
 *           description: The quantity of the dish in the order.
 *         isActive:
 *           type: boolean
 *           description: The status of the dish in the order.
 */
