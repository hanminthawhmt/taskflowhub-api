const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/env");
const generateToken = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;
