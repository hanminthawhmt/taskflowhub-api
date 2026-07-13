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

module.exports = { createTask };
