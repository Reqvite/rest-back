/**
 * @openapi
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - _id
 *         - description
 *         - picture
 *         - address
 *         - phone
 *         - type
 *         - webSite
 *         - workHours
 *         - dishes_ids
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the restaurant.
 *         _id:
 *           type: string ( ObjectId )
 *           RegExp: /^[0-9a-fA-F]{24}$/
 *           description: The unique ID of the restaurant.
 *         description:
 *           type: string
 *           description: A description of the restaurant.
 *         picture:
 *           type: string
 *           description: A picture of the restaurant.
 *         address:
 *           type: string
 *           description: The address of the restaurant.
 *         phone:
 *           type: string
 *           description: The phone number of the restaurant.
 *         type:
 *           type: string
 *           description: The type of restaurant.
 *         webSite:
 *           type: string
 *           description: The restaurant's website.
 *         workHours:
 *           type: object
 *           properties:
 *             Sunday:
 *               type: string
 *               description: Sunday work hours.
 *             Monday:
 *               type: string
 *               description: Monday work hours.
 *             Tuesday:
 *               type: string
 *               description: Tuesday work hours.
 *             Wednesday:
 *               type: string
 *               description: Wednesday work hours.
 *             Thursday:
 *               type: string
 *               description: Thursday work hours.
 *             Friday:
 *               type: string
 *               description: Friday work hours.
 *             Saturday:
 *               type: string
 *               description: Saturday work hours.
 *         dishes_ids:
 *           type: array
 *           items:
 *             type: string (ObjectId)
 *           description: An array of dish IDs associated with the restaurant
 */
