const { z } = require("zod");

const createProjectSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().max(2000, "Description is too long").optional(),
});

const addProjectMemberSchema = z.preprocess(
  (data) => {
    if (Array.isArray(data)) return { members: data };
    if (data && Array.isArray(data.members)) return data;
    if (data && typeof data === "object") return { members: [data] };
    return data;
  },
  z.object({
    members: z
      .array(
        z.object({
          user_id: z.coerce.number().int().positive(),
          role_id: z.coerce.number().int().positive(),
        }),
      )
      .min(1, "At least one member is required"),
  }),
);

module.exports = { createProjectSchema, addProjectMemberSchema };
