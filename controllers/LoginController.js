const Personnel = require('../models/personnelModel');
const tokenController = require('./TokenController');
const bcrypt = require('bcrypt');

const loginController = {
  getUserByEmail: async (email) => {
    const user = await Personnel.findOne({ email });
    if (!user) {
      throw new Error(`Couldn't find a user with this email`);
    }

    return user;
  },

  authenticateUser: async (user) => {
    try {
      const userEntity = await loginController.getUserByEmail(user.email);
      const isValidated = await bcrypt.compare(user.password, userEntity.password);
      if (!isValidated) {
        throw new Error(`Credentials do not match. Access denied.`);
      }
      const tokens = await tokenController.getTokens(userEntity._id);
      return {
        ...tokens,
        userId: userEntity._id,
        name: userEntity.name,
        role: userEntity.role,
        restaurantId: userEntity.restaurant_id,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  },

  loginUser: async (req, res) => {
    try {
      const auth = await loginController.authenticateUser(req.body);
      res.status(200).json({
        message: 'Authenticated',
        ...auth,
      });
    } catch (error) {
      if (error.message === "Couldn't find a user with this email") {
        res.status(404).json({ message: 'This email does not exist.' });
      } else if (error.message === 'Credentials do not match. Access denied.') {
        res.status(403).json({ message: 'Incorrect credentials. Please check your data.' });
      } else {
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
      }
    }
  },
};

module.exports = loginController;
