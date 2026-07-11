const projectController = require("./controller");
const authenticate = require("../../middleware/authenticate");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const validate = require("../../middleware/validate");
const projectValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/companies/:companyId",
  authenticate,
  checkCompanyMember,
  validate(projectValidation.createProjectSchema),
  projectController.handleCreateProject,
);

module.exports = router;
