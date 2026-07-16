const usersRepo = require("./repository");
const AppError = require("../../util/appError");

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

module.exports = { updateProfile };
