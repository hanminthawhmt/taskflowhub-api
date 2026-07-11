const roleRepo = require("./repository");
const AppError = require("../../util/app_error");

const getOwnerRole = async () => {
  const role = await roleRepo.findRoleByTitleScope("Owner", "company");
  if (!role) {
    throw new AppError("Owner role not configured", 500);
  }
  return role;
};

module.exports = { getOwnerRole };
