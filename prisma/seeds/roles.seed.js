const prisma = require('../../src/config/db');

async function seedRoles() {
  await prisma.role.createMany({
    data: [
      // Company Roles
      { title: "Owner", scope: "company" },
      { title: "Admin", scope: "company" },
      { title: "Manager", scope: "company" },
      { title: "Member", scope: "company" },
      { title: "Guest", scope: "company" },

      // Project Roles
      { title: "Owner", scope: "project" },
      { title: "Manager", scope: "project" },
      { title: "Developer", scope: "project" },
      { title: "Viewer", scope: "project" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Roles seeded");
}

module.exports = { seedRoles };
