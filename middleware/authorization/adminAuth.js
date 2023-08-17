const tokenController = require('../../controllers/TokenController');
const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../../utils/errors/CustomErrors');

require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const checkAdminAuth = async (req, _, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthorizationError('User authorization failed. Access denied.');
    }

    const restaurantId = req.params.rest_id || req.body.restaurant_id;

    const token = authHeader.split(' ')[1];
    const { id: user_id } = jwt.verify(token, JWT_SECRET_KEY);

    const userData = await tokenController.getUserById(user_id);
    const { restaurant_id, role } = userData;
    console.log(role);

    if (restaurantId !== restaurant_id.toString() || role !== 'admin') {
      throw new AuthorizationError('User authorization failed. Access denied.');
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAdminAuth;
