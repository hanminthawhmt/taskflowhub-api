const companyController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const requirePermission = require("../../middleware/requirePermission");
const requireSuperAdmin = require("../../middleware/requireSuperAdmin");
const companyValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.get(
  "/:companyId",
  authenticate,
  checkCompanyMember,
  companyController.handleGetCompanyDetails,
);

router.get(
  "/:companyId/members",
  authenticate,
  checkCompanyMember,
  companyController.handleListMembers,
);

router.patch(
  "/:companyId",
  authenticate,
  checkCompanyMember,
  requirePermission("update_company_settings"),
  validate(companyValidation.updateCompanyName),
  companyController.handleUpdateCompanyName,
);

router.post(
  "/:companyId/invitations",
  authenticate,
  checkCompanyMember,
  requirePermission("invite_company_member"),
  validate(companyValidation.inviteMemberSchema),
  companyController.handleInviteMember,
);

router.get(
  "/admin/all",
  authenticate,
  requireSuperAdmin,
  companyController.handleGetAllCompanies,
);

router.get("/", authenticate, companyController.handleListCompanies);

// Path A — existing user
router.post(
  "/invitations/:token/accept",
  authenticate,
  companyController.handleAcceptInvitation,
);

// Path B — brand new user
router.post(
  "/invitations/:token/register",
  validate(companyValidation.registerViaInvitationSchema),
  companyController.handleRegisterViaInvitation,
);

router.get("/invitations/:token", companyController.handleGetInvitationDetails);

module.exports = router;
