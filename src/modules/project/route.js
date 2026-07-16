const projectController = require("./controller");
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const checkProjectMember = require("../../middleware/checkProjecMember");
const checkAssigneeIsCompanyMember = require("../../middleware/checkAssigneeIsCompanyMember");
const checkInviteeIsCompanyMember = require("../../middleware/checkInviteeIsCompanyMember");
const checkProjectLimit = require("../../middleware/checkProjectLimit");
const checkSubscriptionActive = require("../../middleware/checkSubscriptionActive");
const validate = require("../../middleware/validate");
const requirePermission = require("../../middleware/requirePermission");
const projectValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/companies/:companyId/projects",
  authenticate,
  checkCompanyMember,
  requirePermission("create_project"),
  checkSubscriptionActive,
  checkProjectLimit,
  validate(projectValidation.createProjectSchema),
  projectController.handleCreateProject,
);

router.post(
  "/companies/:companyId/projects/:projectId/members",
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

router.get(
  "/companies/:companyId/projects",
  authenticate,
  checkCompanyMember,
  projectController.handleListProjects,
);

router.post(
  "/projects/invitations/:token/accept",
  authenticate,
  projectController.handleAcceptInvitation,
);

router.get(
  "/companies/:companyId/projects/:projectId/members",
  authenticate,
  checkCompanyMember,
  checkProjectMember,
  requirePermission("view_project"),
  projectController.handleListProjectMembers,
);

router.patch(
  "/companies/:companyId/projects/:projectId",
  authenticate,
  checkCompanyMember,
  checkProjectMember,
  requirePermission("update_project_settings"),
  validate(projectValidation.updateProjectSchema),
  projectController.handleUpdateProject,
);

router.delete(
  "/companies/:companyId/projects/:projectId",
  authenticate,
  checkCompanyMember,
  checkProjectMember,
  requirePermission("delete_project"),
  projectController.handleDeleteProject,
);

module.exports = router;
