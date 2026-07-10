const authController = require("./controller");
const router = require("express").Router();

router.post("/login", authController.handleLogIn);
router.post("/register", authController.handleRegister);

module.exports = router;
