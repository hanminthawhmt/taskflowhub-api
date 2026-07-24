const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().max(2000, "Description is too long").optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  status: z.enum(["pending", "complete"]).default("pending"),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  user_id: z.coerce.number().int().positive().optional(),
});

const updateTaskStatusSchema = z.object({
  status: z.enum(["pending", "complete"]),
});

const updateTaskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  description: z.string().max(2000, "Description is too long").optional(),
  priority: z.enum(["high", "medium", "low"]).optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  user_id: z.coerce.number().int().positive().optional(),
});

module.exports = { createTaskSchema, updateTaskStatusSchema, updateTaskSchema };
