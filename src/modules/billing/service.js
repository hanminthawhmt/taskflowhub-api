const billingRepo = require("./repository");
const stripe = require("../../config/stripe");
const AppError = require("../../util/appError");
const activityLogService = require("../activity_log/service");

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

const handleCheckoutCompleted = async (session) => {
  const companyId = Number(session?.metadata?.companyId);
  const planId = Number(session?.metadata?.planId);

  if (!session?.subscription) {
    throw new AppError("Missing Stripe subscription in checkout session", 400);
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  const firstItem = subscription?.items?.data?.[0];
  const priceId = firstItem?.price?.id || null;

  const activatedSubscription = await billingRepo.activateSubscription({
    companyId,
    planId,
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription,
    stripeStatus: subscription?.status || "unknown",
    stripePrice: priceId,
  });

  const company = await billingRepo.findCompanyById(companyId);

  await activityLogService.log({
    companyId,
    projectId: null,
    userId: company?.createdBy ?? 0,
    action: "subscription_activated",
    subjectType: "subscription",
    subjectId: companyId,
    meta: {
      planId,
      stripeSubscriptionId: session.subscription,
      stripeStatus: activatedSubscription?.stripeStatus || subscription?.status,
    },
  });
};

const handleSubscriptionUpdated = async (subscription) => {
  const company = await billingRepo.updateSubscriptionStatus(
    subscription.id,
    subscription.status,
  );

  await activityLogService.log({
    companyId: company?.id,
    projectId: null,
    userId: company?.createdBy ?? 0,
    action: "subscription_status_changed",
    subjectType: "subscription",
    subjectId: company?.id,
    meta: {
      stripeSubscriptionId: subscription.id,
      stripeStatus: subscription.status,
    },
  });
};

const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionUpdated(event.data.object);
      break;
    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }
};

module.exports = { createCheckoutSession, handleWebhookEvent };
