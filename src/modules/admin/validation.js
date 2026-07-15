const { z } = require("zod");

const promoteSuperAdminSchema = z.object({
  user_id: z.coerce.number().int().positive(),
});

module.exports = { promoteSuperAdminSchema };
