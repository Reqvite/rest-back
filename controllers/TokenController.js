const Token = require('../models/tokenModel');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const util = require('util');
const { NotFoundError, AuthorizationError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
const JWT_REFRESH_EXPIRE_TIME = Number(process.env.JWT_REFRESH_EXPIRE_TIME);

const jwtSignAsync = util.promisify(jwt.sign);
const jwtVerifyAsync = util.promisify(jwt.verify);

const tokenController = {
  get: async (user_id, token_id) => {
    const token = await Token.findOne({ user_id, token_id });
    if (!token) {
      throw new NotFoundError('Token is not found!');
    }

    return token;
  },

  getUserById: async (user_id) => {
    const user = await Token.findOne({ user_id });
    if (!user) {
      throw new NotFoundError('User is not found!');
    }

    return user;
  },

  upsert: async (tokenData) =>
    Token.findOneAndUpdate(
      { user_id: tokenData.user_id },
      { $set: tokenData },
      { upsert: true, new: true }
    ),

  getTokens: async (user_id, restaurant_id, role) => {
    const token = await jwtSignAsync({ id: user_id }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    });

    const token_id = randomUUID();
    const refreshToken = await jwtSignAsync({ id: user_id, token_id }, JWT_REFRESH_SECRET_KEY, {
      expiresIn: JWT_REFRESH_EXPIRE_TIME,
    });

    await tokenController.upsert({
      user_id,
      token_id,
      token,
      refreshToken,
      expire: Date.now() + JWT_REFRESH_EXPIRE_TIME * 1000,
      restaurant_id,
      role,
    });

    return { token, refreshToken };
  },

  refresh: async (user_id, token_id) => {
    try {
      const token = await tokenController.get(user_id, token_id);

      if (Date.now() > token.expire) {
        throw new AuthorizationError('Token is expired');
      }
      const tokens = await tokenController.getTokens(user_id, token.restaurant_id, token.role);

      return tokens;
    } catch (error) {
      throw new AuthorizationError('Invalid refresh token');
    }
  },

  getUserToken: async (req, res) => {
    try {
      const user_id = req.params.id;
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthorizationError('User authorization failed. Access denied.');
      }
      const refreshToken = authHeader.split(' ')[1];

      const { id: userId, token_id } = await jwtVerifyAsync(refreshToken, JWT_REFRESH_SECRET_KEY);

      if (userId !== user_id) {
        throw new AuthorizationError('User authorization failed. Access denied.');
      }

      const tokens = await tokenController.refresh(user_id, token_id);

      res.status(OK).send(tokens);
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
  },
};

module.exports = tokenController;
