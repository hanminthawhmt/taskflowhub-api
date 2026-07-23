const taskRepo = require("./repository");
const projectRepo = require("../project/repository");
const AppError = require("../../util/appError");
const activityLogService = require("../activity_log/service");

const createTask = async ({
  title,
  description,
  priority,
  status,
  start_date,
  end_date,
  created_by,
  project_id,
  user_id,
}) => {
  try {
    if (!title || title.trim().length < 2) {
      throw new AppError("Title must be at least 2 characters", 400);
    }

    const task = await taskRepo.createTask({
      title: title.trim(),
      description,
      priority,
      status,
      start_date,
      end_date,
      created_by,
      project_id,
      user_id,
    });
    const project = await projectRepo.getProjectById(project_id);

    await activityLogService.log({
      companyId: project?.companyId ?? null,
      projectId: task.projectId,
      userId: created_by,
      action: "task_created",
      subjectType: "task",
      subjectId: task.id,
      meta: {
        title: task.title,
        priority: task.priority,
      },
    });

    return task;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      error.message || "Failed to create task",
      error.statusCode || 500,
    );
  }
};

const getMyTasks = async ({ projectId, userId }) => {
  const tasks = await taskRepo.findMyTasksInProject(projectId, userId);
  return tasks;
};

const updateStatus = async ({ taskId, userId, status }) => {
  const task = await taskRepo.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  if (task.userId !== userId) {
    throw new AppError("You can only update tasks assigned to you", 403);
  }
  const updated = await taskRepo.updateStatus(taskId, status);
  const project = await projectRepo.getProjectById(task.projectId);
  await activityLogService.log({
    companyId: project?.companyId ?? null,
    projectId: task.projectId,
    userId,
    action: "task_status_updated",
    subjectType: "task",
    subjectId: task.id,
    meta: {
      title: task.title,
      newStatus: status,
      previousStatus: task.status, // worth adding — you have this for free before the update overwrites it
    },
  });

  return updated;
};

const listProjectTasks = async (projectId, filters) => {
  const tasks = await taskRepo.findAllTasksInProject(projectId, filters);

  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    startDate: t.startDate,
    endDate: t.endDate,
    assignee: t.user
      ? { id: t.user.id, name: t.user.name, email: t.user.email }
      : null,
    createdAt: t.createdAt,
  }));
};

const getUpcomingTasksForCompany = async (companyId, userId, days) => {
  const lookaheadDays = Number(days) || 7;
  const lookaheadDate = new Date();
  lookaheadDate.setDate(lookaheadDate.getDate() + lookaheadDays);

  const tasks = await taskRepo.findUpcomingTasksForUser(
    companyId,
    userId,
    lookaheadDate,
  );

  return tasks.map((t) => ({
    id: t.id,
    title: t.title,
    projectTitle: t.project.title,
    endDate: t.endDate,
    priority: t.priority,
  }));
};

module.exports = {
  createTask,
  getMyTasks,
  getMyTasks,
  updateStatus,
  listProjectTasks,
  getUpcomingTasksForCompany,
};
