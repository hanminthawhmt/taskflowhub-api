const authController = require("./controller");
const validate = require("../../middleware/validate");
const authValidate = require("./validation");
const router = require("express").Router();

router.post(
  "/login",
  validate(authValidate.loginSchema),
  authController.handleLogIn,
);
router.post(
  "/register",
  validate(authValidate.registerSchema),
  authController.handleRegister,
);

module.exports = router;
