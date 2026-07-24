const taskController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const checkProjectMember = require("../../middleware/checkProjecMember");
const checkCompanyMember = require("../../middleware/checkCompanyMember");
const checkAssigneeIsProjectMember = require("../../middleware/checkAssigneeIsProjectMember");
const requirePermission = require("../../middleware/requirePermission");
const taskValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/:projectId/tasks",
  authenticate,
  checkProjectMember,
  requirePermission("create_task"),
  validate(taskValidation.createTaskSchema),
  checkAssigneeIsProjectMember,
  taskController.handleTaskCreate,
);

router.get(
  "/:projectId/tasks",
  authenticate,
  checkProjectMember,
  requirePermission("view_task"),
  taskController.handleListProjectTasks,
);

router.get(
  "/:projectId/mine",
  authenticate,
  checkProjectMember,
  taskController.handleGetMyTasks,
);

router.patch(
  "/:projectId/tasks/:taskId/status",
  authenticate,
  checkProjectMember,
  validate(taskValidation.updateTaskStatusSchema),
  taskController.handleUpdateTaskStatus,
);

router.patch(
  "/:projectId/tasks/:taskId",
  authenticate,
  checkProjectMember,
  requirePermission("update_any_task"),
  validate(taskValidation.updateTaskSchema),
  taskController.handleUpdateTask,
);

router.delete(
  "/:projectId/tasks/:taskId",
  authenticate,
  checkProjectMember,
  requirePermission("delete_task"),
  taskController.handleDeleteTask,
);

router.get(
  "/companies/:companyId/tasks/upcoming",
  authenticate,
  checkCompanyMember,
  requirePermission("view_task"),
  taskController.handleGetUpcomingTasks,
);

module.exports = router;
