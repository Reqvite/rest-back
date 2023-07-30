const DB = require("../models/personnelModel");
const tokenController = require("./TokenController");
const bcrypt = require("bcrypt");

const loginController = {
  getUserByEmail: async email => {
    const user = await DB.Personnel.findOne({ email });
    if (!user) {
      throw new Error(`Couldn't find a user with this email - ${email}`);
    }

    return user;
  },

  authenticateUser: async user => {
    const userEntity = await loginController.getUserByEmail(user.email);
    const isValidated = await bcrypt.compare(user.password, userEntity.password);
    if (!isValidated) {
      throw new Error(`Credentials do not match. Access denied.`);
    }
    const tokens = await tokenController.getTokens(userEntity._id);
    return { ...tokens, userId: userEntity._id, name: userEntity.name };
  },

  loginUser: async (req, res) => {
    try {
      const auth = await loginController.authenticateUser(req.body);
      res.status(200).json({
        message: "Authenticated",
        ...auth
      });
    } catch {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

module.exports = loginController;
