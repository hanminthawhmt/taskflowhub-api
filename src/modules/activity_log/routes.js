const authenticate = require("../../middleware/authenticate");
const requireSuperAdmin = require("../../middleware/requireSuperAdmin");
const activityLogController = require("./controller");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const requirePermission = require("../../middleware/requirePermission");
const express = require("express");
const router = express.Router();

router.get(
  "/activity-logs",
  authenticate,
  requireSuperAdmin,
  activityLogController.handleGetAllActivity,
);

router.get(
  "/companies/:companyId/activity-logs",
  authenticate,
  checkCompanyMember,
  requirePermission("view_company"),
  activityLogController.handleGetCompanyActivity,
);

module.exports = router;
