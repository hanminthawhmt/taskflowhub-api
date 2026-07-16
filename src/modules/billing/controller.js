const billingService = require("./service");
const { STRIPE_WEBHOOK_SECRET } = require("../../config/env");
const stripe = require("../../config/stripe");

const handleListPlans = async (req, res, next) => {
  try {
    const plans = await billingService.listPlans();
    res.status(200).json({ data: plans });
  } catch (error) {
    next(error);
  }
};

const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const payload = req.rawBody || req.body;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await billingService.handleWebhookEvent(event);
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook event:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};

const handleCreateCheckoutSession = async (req, res, next) => {
  try {
    const { checkoutUrl } = await billingService.createCheckoutSession({
      companyId: Number(req.params.companyId),
      planId: req.body.plan_id,
      userEmail: req.user.email,
    });
    res.status(200).json({ checkoutUrl });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateCheckoutSession,
  handleStripeWebhook,
  handleListPlans,
};
