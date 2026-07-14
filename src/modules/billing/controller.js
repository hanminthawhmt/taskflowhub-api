const billingService = require("./service");

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

module.exports = { handleCreateCheckoutSession };
