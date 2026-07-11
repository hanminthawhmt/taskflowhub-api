const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const AppError = require("../util/app_error");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new AppError("No token provided", 401));
  }

  const token = authHeader.splits(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

module.exports = authenticate;
