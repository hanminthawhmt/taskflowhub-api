const prisma = require("../../config/db");

const createUser = async (data) => {
  const user = await prisma.user.create({ data });
  return user;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

const updateUserById = async (id, data) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });
  return updatedUser;
};

const deleteUserById = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}