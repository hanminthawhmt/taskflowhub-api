const companyController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const requirePermission = require("../../middleware/requirePermisssion");
const requireSuperAdmin = require("../../middleware/requireSuperAdmin");
const companyValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/:companyId/invitations",
  authenticate,
  checkCompanyMember,
  requirePermission("invite_company_member"),
  validate(companyValidation.inviteMemberSchema),
  companyController.handleInviteMember,
);

router.get(
  "/",
  authenticate,
  requireSuperAdmin,
  companyController.handleGetAllCompanies,
);

module.exports = router;
