const prisma = require("../../config/db");

const findUserById = (id) => {
  return prisma.user.findUnique({ where: { id } });
};

const promoteToSuperAdmin = (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { platformRole: "super_admin" },
  });
};

module.exports = { findUserById, promoteToSuperAdmin };
