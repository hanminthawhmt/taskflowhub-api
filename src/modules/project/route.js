const projectController = require("./controller");
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const checkAssigneeIsCompanyMember = require('../../middleware/checkAssigneeIsCompanyMember');
const validate = require("../../middleware/validate");
const projectValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/:companyId/projects",
  authenticate,
  checkCompanyMember,
  validate(projectValidation.createProjectSchema),
  projectController.handleCreateProject,
);

router.post(
  "/:companyId/projects/:projectId/members",
  authenticate,
  checkCompanyMember,
  validate(projectValidation.addProjectMemberSchema),
  checkAssigneeIsCompanyMember,
  projectController.handleAddProjectMembers,
);

module.exports = router;
