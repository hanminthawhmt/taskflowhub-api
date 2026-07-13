const { seedRoles } = require("./seeds/roles.seed");
const { seedPermissions } = require("./seeds/permissions.seed");
const prisma = require("../src/config/db");

async function main() {
  await seedRoles();
  await seedPermissions();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
