const prisma = require("../../config/db");

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
  const task = await prisma.task.create({
    data: {
      projectId: project_id,
      userId: user_id,
      createdBy: created_by,
      title: title,
      description: description,
      priority: priority,
      status: status,
      startDate: start_date,
      endDate: end_date,
    },
  });
  return task;
};

const findById = (taskId) => {
  return prisma.task.findUnique({ where: { id: taskId } });
};

const findMyTasksInProject = async (projectId, userId) => {
  const projects = await prisma.task.findMany({
    where: { projectId, userId },
    orderBy: { createdAt: "desc" },
  });
  return projects;
};

const updateStatus = (taskId, status) => {
  return prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
};

const findAllTasksInProject = (projectId, filters = {}) => {
  const where = { projectId };

  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.userId) where.userId = filters.userId;

  return prisma.task.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const findUpcomingTasksForUser = (companyId, userId, lookaheadDate) => {
  return prisma.task.findMany({
    where: {
      project: {
        companyId,
        members: { some: { userId } }, // only projects the user actually belongs to
      },
      endDate: {
        not: null,
        lte: lookaheadDate,
        gte: new Date(),
      },
      status: "pending", // no point surfacing already-completed tasks as "upcoming"
    },
    include: {
      project: { select: { title: true } },
    },
    orderBy: { endDate: "asc" },
  });
};

module.exports = {
  createTask,
  findById,
  findMyTasksInProject,
  updateStatus,
  findAllTasksInProject,
  findUpcomingTasksForUser
};
