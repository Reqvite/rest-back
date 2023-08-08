const Token = require('../models/tokenModel');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
require('dotenv').config();
const { NotFoundError, AuthorizationError } = require('../utils/errors/CustomErrors');
const { StatusCodes } = require('http-status-codes');
const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
JWT_EXPIRE_TIME = '1h';
JWT_REFRESH_EXPIRE_TIME = 4.5 * 60 * 60;

const tokenController = {
  get: async (user_id, token_id) => {
    const token = await Token.findOne({ user_id, token_id });
    if (!token) {
      throw new NotFoundError('Token is not found!');
    }

    return token;
  },

  upsert: async (token) =>
    Token.findOneAndUpdate(
      { user_id: token.user_id },
      { $set: token },
      { upsert: true, new: true }
    ),

  getTokens: async (user_id, restaurant_id, role) => {
    const token = jwt.sign({ id: user_id }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME,
    });

    const token_id = randomUUID();
    const refreshToken = jwt.sign({ id: user_id, token_id }, JWT_REFRESH_SECRET_KEY, {
      expiresIn: JWT_REFRESH_EXPIRE_TIME,
    });

    await tokenController.upsert({
      user_id,
      token_id,
      expire: Date.now() + JWT_REFRESH_EXPIRE_TIME * 1000,
      restaurant_id,
      role,
    });

    return { token, refreshToken };
  },

  refresh: async (user_id, token_id) => {
    const token = await tokenController.get(user_id, token_id);
    if (Date.now() > token.expire) {
      throw new AuthorizationError('Token is expired');
    }
    return tokenController.getTokens(user_id);
  },

  getUserToken: async (req, res) => {
    try {
      const tokens = await tokenController.refresh(req.user_id, req.token_id);
      res.status(OK).send(tokens);
    } catch {
      res.status(INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' });
    }
  },
};

module.exports = tokenController;
