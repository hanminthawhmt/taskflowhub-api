const roleRepo = require("./repository");
const AppError = require("../../util/appError");

const getOwnerRole = async (title, scope) => {
  const role = await roleRepo.findRoleByTitleScope(title, scope);
  if (!role) {
    throw new AppError("Owner role not configured", 500);
  }
  return role;
};

module.exports = { getOwnerRole };
