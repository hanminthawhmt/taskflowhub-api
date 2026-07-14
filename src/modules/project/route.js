const projectController = require("./controller");
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const checkProjectMember = require("../../middleware/checkProjecMember");
const checkAssigneeIsCompanyMember = require("../../middleware/checkAssigneeIsCompanyMember");
const checkInviteeIsCompanyMember = require("../../middleware/checkInviteeIsCompanyMember")
const validate = require("../../middleware/validate");
const requirePermission = require("../../middleware/requirePermisssion");
const projectValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/:companyId/projects",
  authenticate,
  checkCompanyMember,
  requirePermission("create_project"),
  validate(projectValidation.createProjectSchema),
  projectController.handleCreateProject,
);

router.post(
  "/:companyId/projects/:projectId/members",
  authenticate,
  checkCompanyMember,
  requirePermission("invite_project_member"),
  validate(projectValidation.addProjectMemberSchema),
  checkAssigneeIsCompanyMember,
  projectController.handleAddProjectMembers,
);

router.post(
  "/projects/:projectId/invitations",
  authenticate,
  checkProjectMember,
  requirePermission("invite_project_member"),
  validate(projectValidation.inviteProjectMemberSchema),
  checkInviteeIsCompanyMember,
  projectController.handleInviteProjectMember,
);

module.exports = router;
