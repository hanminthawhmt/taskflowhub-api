const userRepo = require("./repository");

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

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}
