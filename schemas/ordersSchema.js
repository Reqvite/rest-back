/**
 * @openapi
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - Open
 *             - Paid
 *           default: Open
 *         orderItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dish:
 *                 type: string
 *                 format: objectId
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               status:
 *                 type: string
 *                 enum:
 *                   - Ordered
 *                   - In progress
 *                   - Ready
 *                   - Served
 *                 default: Ordered
 *         table_id:
 *           type: string
 *           format: objectId
 *           description: Table id is required
 *         rest_id:
 *           type: string
 *           format: objectId
 *           description: Restaurant id
 *       required:
 *         - table_id
 *       example:
 *         status: Open
 *         orderItems:
 *           - dish: "615f438200bfc42dd4d7fdd2"
 *             quantity: 2
 *             status: Ordered
 *           - dish: "615f439700bfc42dd4d7fdd4"
 *             quantity: 1
 *             status: In progress
 *         table_id: "615f437d00bfc42dd4d7fdd0"
 *         rest_id: "615f437d00bfc42dd4d7fdd0"
 *
 */
