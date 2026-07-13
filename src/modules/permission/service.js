const permissionRepo = require("./repository");

const getAllPermission = async () => {
  return await permissionRepo.getAllPermission();
};

const createPermission = async ({ name }) => {
  return await permissionRepo.createPermission(name);
};

module.exports = { getAllPermission, createPermission };