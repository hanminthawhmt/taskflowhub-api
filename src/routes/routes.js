const authRoutes = require("../modules/auth/route");
const projectRoutes = require("../modules/project/route");
const taskRoutes = require("../modules/task/route");
const permissionRoutes = require("../modules/permission/route");
const companyRoutes = require("../modules/company/route");
const activityLogRoutes = require("../modules/activity_log/routes");
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/companies", companyRoutes);
router.use("/", projectRoutes);
router.use("/projects", taskRoutes);
router.use("/permissions", permissionRoutes);
router.use("/activity-logs", activityLogRoutes);

module.exports = router;
