const adminRepo = require("./repository");
const AppError = require("../../util/appError");

const promoteToSuperAdmin = async (userId) => {
  const user = await adminRepo.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (user.platformRole === "super_admin") {
    throw new AppError("User is already a super admin", 400);
  }

  const { password: _, ...safeUser } =
    await adminRepo.promoteToSuperAdmin(userId);
  return safeUser;
};

module.exports = { promoteToSuperAdmin };
