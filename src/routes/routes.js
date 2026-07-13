const authRoutes = require("../modules/auth/route");
const projectRoutes = require("../modules/project/route");
const taskRoutes = require("../modules/task/route");
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/companies", projectRoutes);
router.use("/projects", taskRoutes);

module.exports = router;
