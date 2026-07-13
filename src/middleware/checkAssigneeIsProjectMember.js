const prisma = require("../config/db");
const AppError = require("../util/appError");

const checkAssigneeIsProjectMember = async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const assigneeId = req.body.user_id;
    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId: assigneeId },
    });
    if (!membership) {
      return next(
        new AppError("Assigned user is not a member of this project", 400),
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkAssigneeIsProjectMember;
