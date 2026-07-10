const userService = require("./service");

const handleCreateUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({
      success: true,
      data: author,
    });
  } catch (error) {
    next(error);
  }
};

const handleLogIn = async (req, res, next) => {
  try {
  } catch (error) {}
};

const handleRegister = async (req, res, next) => {
  try {
  } catch (error) {}
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
