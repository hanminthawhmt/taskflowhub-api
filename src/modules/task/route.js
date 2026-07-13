const taskController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const checkProjectMember = require("../../middleware/checkProjecMember");
const checkAssigneeIsProjectMember = require("../../middleware/checkAssigneeIsProjectMember");
const requirePermission = require("../../middleware/requirePermisssion");
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
module.exports = router;
