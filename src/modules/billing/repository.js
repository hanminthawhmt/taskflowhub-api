const prisma = require("../../config/db");

const findPlanById = (id) => {
  return prisma.plan.findUnique({ where: { id } });
};

const findCompanyById = (id) => {
  return prisma.company.findUnique({ where: { id } });
};

const updateCompanyStripeId = (companyId, stripeCustomerId) => {
  return prisma.company.update({
    where: { id: companyId },
    data: { stripeId: stripeCustomerId },
  });
};

module.exports = {
  findPlanById,
  findCompanyById,
  updateCompanyStripeId,
};
