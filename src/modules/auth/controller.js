const userService = require("./service");

const handleCreateUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const handleLogIn = async (req, res, next) => {
  try {
    const { user, token } = await userService.loginUser(req.body);
    res.status(200).json({
      message: "Login Successful",
      data: user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const handleRegister = async (req, res, next) => {
  try {
    const { user, token } = await userService.registerUser(req.body);
    res.status(201).json({
      message: "User Registered",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetUserById = async (req, res, next) => {
  try {
  } catch (error) {}
};

const handleUpdateUserById = async (req, res, next) => {
  try {
  } catch (error) {}
};

const handleGetAllUsers = async (req, res, next) => {
  try {
  } catch (error) {}
};

const handleDeleteUser = async (req, res, next) => {
  try {
  } catch (error) {}
};

module.exports = {
  handleCreateUser,
  handleDeleteUser,
  handleGetAllUsers,
  handleUpdateUserById,
  handleGetUserById,
  handleLogIn,
  handleRegister,
};
