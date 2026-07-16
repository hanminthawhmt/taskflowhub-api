const usersRepo = require("./repository");
const AppError = require("../../util/appError");
const bcrypt = require("bcrypt");

const updateProfile = async (userId, { name, email }) => {
  if (email) {
    const existing = await usersRepo.findByEmail(email);
    if (existing && existing.id !== userId) {
      throw new AppError("Email already in use", 409);
    }
  }

  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;

  const updated = await usersRepo.updateProfile(userId, data);
  const { password: _, ...safeUser } = updated;
  return safeUser;
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await usersRepo.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new AppError(
      "New password must be different from the current password",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await usersRepo.updatePassword(userId, hashedPassword);
};

module.exports = { updateProfile, updatePassword };
