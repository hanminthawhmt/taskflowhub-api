const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/authenticate");
const validate = require("../../middleware/validate");
const usersValidation = require("./validation");
const usersController = require("./controller");

router.patch(
  "/me",
  authenticate,
  validate(usersValidation.updateProfileSchema),
  usersController.handleUpdateProfile,
);

router.put(
  "/me/password",
  authenticate,
  validate(usersValidation.updatePasswordSchema),
  usersController.handleUpdatePassword,
);

module.exports = router;
