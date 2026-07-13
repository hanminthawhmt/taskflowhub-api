const taskController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const checkProjectMember = require("../../middleware/checkProjecMember");
const taskValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/:projectId/tasks",
  authenticate,
  checkProjectMember,
  validate(taskValidation.createTaskSchema),
  taskController.handleTaskCreate,
);

module.exports = router;
