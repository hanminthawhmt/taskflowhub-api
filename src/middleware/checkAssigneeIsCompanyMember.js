const prisma = require("../config/db");
const AppError = require("../util/appError");

const checkAssigneeIsCompanyMember = async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);
    const userIds = req.body.members.map((m) => m.user_id);
    const memberships = await prisma.companyMember.findMany({
      where: { companyId, userId: { in: userIds } },
    });
    const foundIds = memberships.map((m) => m.userId);
    const missing = userIds.filter((id) => !foundIds.includes(id));
    if (missing.length > 0) {
      throw new AppError(
        `The following users are not members of this company: ${missing.join(", ")}`,
        400,
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAssigneeIsCompanyMember;
