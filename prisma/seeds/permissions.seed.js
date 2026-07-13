const prisma = require("../../src/config/db");
async function seedPermissions() {
  await prisma.permission.createMany({
    data: [
      // Company
      { name: "view_company" },
      { name: "update_company_settings" },
      { name: "delete_company" },
      { name: "invite_company_member" },
      { name: "remove_company_member" },
      { name: "assign_company_role" },

      // Project
      { name: "view_project" },
      { name: "create_project" },
      { name: "update_project_settings" },
      { name: "delete_project" },
      { name: "invite_project_member" },
      { name: "remove_project_member" },
      { name: "assign_project_role" },

      // Task
      { name: "view_task" },
      { name: "create_task" },
      { name: "assign_task" },
      { name: "update_own_task_status" },
      { name: "update_any_task" },
      { name: "delete_task" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Permissions seeded");
}

module.exports = { seedPermissions };
