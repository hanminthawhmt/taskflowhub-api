const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/authenticate");
const requireSuperAdmin = require("../../middleware/requireSuperAdmin");
const validate = require("../../middleware/validate");
const adminValidation = require("./validation");
const adminController = require("./controller");

router.post(
  "/promote-super-admin",
  authenticate,
  requireSuperAdmin, // only an existing super admin can create another
  validate(adminValidation.promoteSuperAdminSchema),
  adminController.handlePromoteSuperAdmin,
);

module.exports = router;
