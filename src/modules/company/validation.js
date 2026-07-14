const { z } = require("zod");

const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role_id: z.coerce.number().int().positive(),
});

const registerViaInvitationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

module.exports = {
  inviteMemberSchema,
  registerViaInvitationSchema,
};
