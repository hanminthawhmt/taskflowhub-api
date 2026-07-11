const prisma = require("../config/db");
const AppError = require("../util/appError");

const checkCompanyMember = async (req, res, next) => {
  try {
    const companyId  = Number(req.params.companyId);
    const userId = req.user.userId;

    const membership = await prisma.companyMember.findFirst({
      where: { userId, companyId },
    });

    if (!membership) {
      return next(new AppError("You are not a member of this company", 403));
    }
    req.companyMembership = membership;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkCompanyMember;
