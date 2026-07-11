const { z } = require("zod");

const createProjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().max(2000, "Description is too long").optional(),
});

module.exports = { createProjectSchema };
