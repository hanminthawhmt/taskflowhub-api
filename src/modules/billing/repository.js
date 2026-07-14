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

const findPlanByStripePrice = (stripePriceId) => {
  return prisma.plan.findFirst({ where: { stripePriceId } });
};

const findCompanyByStripeId = (stripeCustomerId) => {
  return prisma.company.findFirst({ where: { stripeId: stripeCustomerId } });
};

const activateSubscription = async ({
  companyId,
  planId,
  stripeCustomerId,
  stripeSubscriptionId,
  stripeStatus,
  stripePrice,
}) => {
  return prisma.$transaction(async (tx) => {
    await tx.company.update({
      where: { id: companyId },
      data: {
        planId,
        stripeId: stripeCustomerId,
        subscriptionStatus: "active",
      },
    });

    return tx.subscription.create({
      data: {
        companyId,
        planId,
        type: "default",
        stripeId: stripeSubscriptionId,
        stripeStatus,
        stripePrice,
      },
    });
  });
};

const updateSubscriptionStatus = async (stripeSubscriptionId, stripeStatus) => {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeId: stripeSubscriptionId },
  });

  if (!subscription) return null;

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { stripeStatus },
  });

  const companyStatus = stripeStatus === "active" ? "active" : "past_due";
  return prisma.company.update({
    where: { id: subscription.companyId },
    data: { subscriptionStatus: companyStatus },
  });
};

module.exports = {
  findPlanById,
  findCompanyById,
  updateCompanyStripeId,
  findPlanByStripePrice,
  findCompanyByStripeId,
  activateSubscription,
  updateSubscriptionStatus
};
