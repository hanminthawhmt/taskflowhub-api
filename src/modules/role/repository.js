const prisma = require("../../config/db");

const findRoleByTitleScope = async (title, scope) => {
  return await prisma.role.findFirst({
    where: { title, scope },
  });
};

module.exports = {
  findRoleByTitleScope,
};
