const prisma = require("../../config/db");

const getAllPermission = async () => {
  return await prisma.permission.findMany();
};

const createPermission = async (data) => {
  return await prisma.permission.create(data);
};

module.exports = { getAllPermission, createPermission };
