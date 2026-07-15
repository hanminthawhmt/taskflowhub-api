const prisma = require("../config/db");
const AppError = require("../util/appError");

const checkSubscriptionActive = async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    if (company.subscriptionStatus !== "active") {
      throw new AppError(
        `Your company's subscription is currently "${company.subscriptionStatus}". Please resolve billing before continuing.`,
        403,
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkSubscriptionActive;
