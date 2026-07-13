const companyController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const requirePermission = require("../../middleware/requirePermisssion");
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

module.exports = router;
