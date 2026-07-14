const prisma = require("../config/db");
const AppError = require("../util/appError");

const checkInviteeIsCompanyMember = async (req, res, next) => {
  try {
    const projectId = Number(req.params.projectId);
    const email = req.body.email;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new AppError("Project not found", 404);
    }

    const invitedUser = await prisma.user.findUnique({ where: { email } });
    if (!invitedUser) {
      throw new AppError(
        "This email is not registered as a user in the platform yet",
        400,
      );
    }

    const companyMembership = await prisma.companyMember.findFirst({
      where: { companyId: project.companyId, userId: invitedUser.id },
    });

    if (!companyMembership) {
      throw new AppError(
        "This user is not a member of the company that owns this project",
        400,
      );
    }

    req.invitedUser = invitedUser; // handy downstream — avoids a re-lookup in the controller
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkInviteeIsCompanyMember;
