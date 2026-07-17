const authRoutes = require("../modules/auth/route");
const projectRoutes = require("../modules/project/route");
const taskRoutes = require("../modules/task/route");
const permissionRoutes = require("../modules/permission/route");
const companyRoutes = require("../modules/company/route");
const activityLogRoutes = require("../modules/activity_log/routes");
const adminRoutes = require("../modules/admin/route");
const usersRoutes = require("../modules/users/route");
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/companies", companyRoutes);
router.use("/", projectRoutes);
router.use("/projects", taskRoutes);
router.use("/permissions", permissionRoutes);
router.use("/", activityLogRoutes);
router.use("/admin", adminRoutes);
router.use("/users", usersRoutes);

module.exports = router;
