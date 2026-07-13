const taskRepo = require("./repository");
const AppError = require("../../util/appError");

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

    return task;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message || "Failed to create task", error.statusCode || 500);
  }
};

module.exports = { createTask };
