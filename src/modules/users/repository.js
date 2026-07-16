const prisma = require("../../config/db");

const findById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const findByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const updateProfile = (id, data) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

module.exports = { findById, findByEmail, updateProfile };
