const DB = require("../models/tokenModel");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
require("dotenv").config();

JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
JWT_EXPIRE_TIME = "4h";
JWT_REFRESH_EXPIRE_TIME = 4.5 * 60 * 60;

const tokenController = {
  get: async (userId, tokenId) => {
    const token = await DB.Token.findOne({ userId, tokenId });
    if (!token) {
      throw new Error("Token is not found!");
    }

    return token;
  },

  upsert: async token =>
    DB.Token.findOneAndUpdate(
      { userId: token.userId },
      { $set: token },
      { upsert: true, new: true }
    ),

  getTokens: async userId => {
    const token = jwt.sign({ id: userId }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRE_TIME
    });

    const tokenId = randomUUID();
    const refreshToken = jwt.sign({ id: userId, tokenId }, JWT_REFRESH_SECRET_KEY, {
      expiresIn: JWT_REFRESH_EXPIRE_TIME
    });

    await tokenController.upsert({
      userId,
      tokenId,
      expire: Date.now() + JWT_REFRESH_EXPIRE_TIME * 1000
    });

    return { token, refreshToken };
  },

  refresh: async (userId, tokenId) => {
    const token = await tokenController.get(userId, tokenId);
    if (Date.now() > token.expire) {
      throw new Error("Token is expired");
    }
    return tokenController.getTokens(userId);
  },

  getUserToken: async (req, res) => {
    try {
      const tokens = await tokenController.refresh(req.userId, req.tokenId);
      res.status(200).send(tokens);
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

module.exports = tokenController;
