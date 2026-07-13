const { z } = require("zod");

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role_id: z.coerce.number().int().positive(),
});

module.exports = {
  inviteMemberSchema,
};
