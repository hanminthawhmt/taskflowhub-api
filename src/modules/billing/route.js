const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const requirePermission = require("../../middleware/requirePermisssion");
const validate = require("../../middleware/validate");
const billingValidation = require("./validation");
const billingController = require("./controller");

router.post(
  "/:companyId/checkout",
  authenticate,
  checkCompanyMember,
  requirePermission("update_company_settings"),
  validate(billingValidation.createCheckoutSessionSchema),
  billingController.handleCreateCheckoutSession,
);

router.post(
  "/webhook",
  express.raw({
    type: "application/json",
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  billingController.handleStripeWebhook,
);

module.exports = router;
