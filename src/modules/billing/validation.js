const { z } = require("zod");

const createCheckoutSessionSchema = z.object({
  plan_id: z.coerce.number().int().positive(),
});

module.exports = { createCheckoutSessionSchema };
