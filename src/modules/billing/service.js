const billingRepo = require("./repository");
const stripe = require("../../config/stripe");
const AppError = require("../../util/appError");

const createCheckoutSession = async ({ companyId, planId, userEmail }) => {
  const plan = await billingRepo.findPlanById(planId);
  if (!plan) {
    throw new AppError("Plan not found", 404);
  }
  if (!plan.stripePriceId) {
    throw new AppError("This plan is not available for purchase", 400);
  }

  const company = await billingRepo.findCompanyById(companyId);
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: company.stripeId || undefined,
    customer_email: company.stripeId ? undefined : userEmail,
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/api/v1/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/api/v1/billing/cancel`,
    metadata: {
      companyId: String(companyId),
      planId: String(planId),
    },
  });
  return { checkoutUrl: session.url };
};

module.exports = { createCheckoutSession };
