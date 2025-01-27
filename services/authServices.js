const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
//dotenv
require("dotenv").config();
exports.login = async (user) => {
  try {
    const loggedUser = await User.findOne({ username: user.username });
    if (loggedUser) {
      if (await bcrypt.compare(user.password, loggedUser.password)) {
        const token = jwt.sign({ _id: loggedUser._id }, "secret");
        const username = loggedUser.username;
        return { token, username, id: loggedUser._id };
      }
    }
  } catch (err) {
    return err;
    // for production
  }
};
