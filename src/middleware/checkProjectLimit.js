const prisma = require("../config/db");
const AppError = require("../util/appError");

const checkProjectLimit = async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { plan: true },
    });

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    // No plan assigned, or unlimited projects — nothing to check
    if (!company.plan || company.plan.maxProjects === null) {
      return next();
    }

    const currentProjectCount = await prisma.project.count({
      where: { companyId },
    });

    if (currentProjectCount >= company.plan.maxProjects) {
      throw new AppError(
        `Your ${company.plan.name} plan allows up to ${company.plan.maxProjects} projects. Upgrade your plan to create more.`,
        403,
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkProjectLimit;
