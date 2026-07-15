const { seedRoles } = require("./seeds/roles.seed");
const { seedPermissions } = require("./seeds/permissions.seed");
const { seedRolePermissions } = require("./seeds/role_permissions.seed");
const { seedPlans } = require("./seeds/plans.seed");
const { seedSuperAdmin } = require("./seeds/superadmin.seed");
const prisma = require("../src/config/db");

async function main() {
  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
  await seedPlans();
  await seedSuperAdmin();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
