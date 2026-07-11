const userRepo = require("./repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../util/app_error");
const generateToken = require("../../util/generate_token");

const createUser = async (data) => {
  const user = await userRepo.createUser(data);
  return user;
};

const getAllUsers = async () => {
  const users = await userRepo.getAllUsers();
  return users;
};

const getUserById = async (id) => {
  const user = await userRepo.getUserById(id);
  return user;
};

const updateUserById = async (id, data) => {
  const updatedUser = await userRepo.updateUserById(id, data);
  return updatedUser;
};

const deleteUserById = async (id) => {
  return await userRepo.deleteUserById(id);
};

const registerUser = async ({ name, email, password }) => {
  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError("User does not exist", 401);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  const token = generateToken(user);
  const { password: _, ...safeUser } = user;
  return {
    user: safeUser,
    token,
  };
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  registerUser,
  loginUser,
};
