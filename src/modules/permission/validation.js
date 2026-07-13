const { z } = require("zod");

const createPermissionSchema = z.object({
  name: z
    .string()
    .min(2, "Permission name must be at least 2 characters")
    .regex(
      /^[a-z_]+$/,
      "Permission name must be snake_case (lowercase letters and underscores only)",
    ),
});

module.exports = { createPermissionSchema };
