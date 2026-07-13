const authenticate = require("../../middleware/authenticate");
const validate = require("../../middleware/validate");
const permissionController = require("./controller");
const permissionValidation = require("./validation");
const requireSuperAdmin = require("../../middleware/requireSuperAdmin");
const express = require("express");
const router = express.Router();

router.post(
  "/",
  authenticate,
  requireSuperAdmin,
  validate(permissionValidation.createPermissionSchema),
  permissionController.handleCreatePermission,
);

router.get(
  "/",
  authenticate,
  requireSuperAdmin,
  permissionController.handleGetAllPermissions,
);

module.exports = router;
