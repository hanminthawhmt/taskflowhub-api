const taskService = require("./service");

const handleTaskCreate = async (req, res, next) => {
  try {
    const task = await taskService.createTask({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      status: req.body.status,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      created_by: req.user?.userId,
      project_id: Number(req.params.projectId),
      user_id: req.body.user_id ?? req.user?.userId,
    });

    res.status(201).json({
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetMyTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getMyTasks({
      projectId: Number(req.params.projectId),
      userId: req.user.userId,
    });
    res.status(200).json({ data: tasks });
  } catch (error) {
    next(error);
  }
};

const handleUpdateTaskStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateStatus({
      taskId: Number(req.params.taskId),
      userId: req.user.userId,
      status: req.body.status,
    });
    res.status(200).json({ message: "Task status updated", data: task });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleTaskCreate, handleGetMyTasks, handleUpdateTaskStatus };
