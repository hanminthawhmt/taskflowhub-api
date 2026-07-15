const authenticate = require("../../middleware/authenticate");
const requireSuperAdmin = require("../../middleware/requireSuperAdmin");
const activityLogController = require("./controller");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  authenticate,
  requireSuperAdmin,
  activityLogController.handleGetAllActivity,
);

module.exports = router;
