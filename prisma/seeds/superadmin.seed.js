const bcrypt = require("bcrypt");
const prisma = require("../../src/config/db");
const {
  SUPERADMIN_EMAIL,
  SUPERADMIN_PASSWORD,
  SUPERADMIN_NAME,
} = require("../../src/config/env");

async function seedSuperAdmin() {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  const name = process.env.SUPERADMIN_NAME || "Super Admin";

  if (!email || !password) {
    console.warn(
      "⚠️  SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD not set — skipping super admin seed",
    );
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("✅ Super admin already exists, skipping");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      platformRole: "super_admin",
    },
  });

  console.log("✅ Super admin created");
}

module.exports = { seedSuperAdmin };
