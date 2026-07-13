const authRoutes = require("../modules/auth/route");
const projectRoutes = require("../modules/project/route");
const taskRoutes = require("../modules/task/route");
const permissionRoutes = require("../modules/permission/route");
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/companies", projectRoutes);
router.use("/projects", taskRoutes);
router.use("/permissions", permissionRoutes);

module.exports = router;
