const authRoutes = require("../modules/auth/route");
const projectRoutes = require("../modules/project/route");
const taskRoutes = require("../modules/task/route");
const permissionRoutes = require("../modules/permission/route");
const companyRoutes = require("../modules/company/route");
const billingRoutes = require("../modules/billing/route");
const activityLogRoutes = require("../modules/activity_log/routes");
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/companies", projectRoutes);
router.use("/projects", taskRoutes);
router.use("/permissions", permissionRoutes);
router.use("/companies", companyRoutes);
router.use("/companies", billingRoutes);
router.use("/activity-log", activityLogRoutes);

module.exports = router;
