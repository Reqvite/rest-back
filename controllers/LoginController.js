const Personnel = require('../models/personnelModel');
const tokenController = require('./TokenController');
const bcrypt = require('bcrypt');
const { NotFoundError, AuthenticationError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK, FORBIDDEN, NOT_FOUND, INTERNAL_SERVER_ERROR } = StatusCodes;

const loginController = {
  getUserByEmail: async (email) => {
    const user = await Personnel.findOne({ email });
    if (!user) {
      throw new NotFoundError(`Couldn't find a user with this email`);
    }

    return user;
  },

  authenticateUser: async (user) => {
    try {
      const userEntity = await loginController.getUserByEmail(user.email);
      const isValidated = await bcrypt.compare(user.password, userEntity.password);
      if (!isValidated) {
        throw new AuthenticationError(`Credentials do not match. Access denied.`);
      }
      const { _id, restaurant_id, role, name } = userEntity;
      const tokens = await tokenController.getTokens(_id, restaurant_id, role);
      return {
        ...tokens,
        userId: _id,
        name: name,
        role: role,
        restaurantId: restaurant_id,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  },

  loginUser: async (req, res) => {
    try {
      const auth = await loginController.authenticateUser(req.body);
      res.status(OK).json({
        message: 'Authenticated',
        ...auth,
      });
    } catch (error) {
      if (error.message === "Couldn't find a user with this email") {
        res
          .status(NOT_FOUND)
          .json({ message: 'Incorrect credentials. Please check your data.', status: NOT_FOUND });
      } else if (error.message === 'Credentials do not match. Access denied.') {
        res
          .status(FORBIDDEN)
          .json({ message: 'Incorrect credentials. Please check your data.', status: FORBIDDEN });
      } else {
        res.status(INTERNAL_SERVER_ERROR).json({
          message: 'Internal server error. Please try again later.',
          status: INTERNAL_SERVER_ERROR,
        });
      }
    }
  },
};

module.exports = loginController;
