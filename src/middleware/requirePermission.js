const prisma = require("../config/db");
const AppError = require("../util/appError");

const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const membership = req.projectMembership || req.companyMembership;

      if (!membership) {
        throw new AppError(
          "Membership context missing — run checkCompanyMember or checkProjectMember first",
          500,
        );
      }

      const rolePermission = await prisma.rolePermission.findFirst({
        where: {
          roleId: membership.roleId,
          permission: { name: permissionName },
        },
      });

      if (!rolePermission) {
        throw new AppError(
          "You do not have permission to perform this action",
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = requirePermission;
