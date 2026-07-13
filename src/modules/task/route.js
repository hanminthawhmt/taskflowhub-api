const taskController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const checkProjectMember = require("../../middleware/checkProjecMember");
const checkAssigneeIsProjectMember = require("../../middleware/checkAssigneeIsProjectMember");
const taskValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/:projectId/tasks",
  authenticate,
  checkProjectMember,
  validate(taskValidation.createTaskSchema),
  checkAssigneeIsProjectMember,
  taskController.handleTaskCreate,
);

module.exports = router;
