const prisma = require("../config/db");
const AppError = require("../util/appError");

const checkProjectMember = async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const userId = req.user.userId;

    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });
    if (!membership) {
      return next(new AppError("You are not a member of this project", 403));
    }
    req.projectMembership = membership;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkProjectMember;
