const { seedRoles } = require("./seeds/roles.seed");
const prisma = require('../src/config/db')

async function main() {
  await seedRoles();
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });