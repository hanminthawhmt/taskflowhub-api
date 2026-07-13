const taskController = require("./controller");
const validate = require("../../middleware/validate");
const authenticate = require("../../middleware/authenticate");
const taskValidation = require("./validation");
const express = require("express");
const router = express.Router();

router.post(
  "/:projectId/tasks",
  authenticate,
  // need to check company member?
  // need to check project member ?
  validate(taskValidation.createTaskSchema),
  taskController.handleTaskCreate,
);

module.exports = router;
