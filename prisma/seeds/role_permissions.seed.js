const prisma = require("../../src/config/db");

const rolePermissionMap = [
  {
    title: "Owner",
    scope: "company",
    permissions: [
      "view_company",
      "update_company_settings",
      "delete_company",
      "invite_company_member",
      "remove_company_member",
      "assign_company_role",
      "view_project",
      "create_project",
      "update_project_settings",
      "delete_project",
      "invite_project_member",
      "remove_project_member",
      "assign_project_role",
      "view_task",
      "create_task",
      "assign_task",
      "update_own_task_status",
      "update_any_task",
      "delete_task",
    ],
  },
  {
    title: "Admin",
    scope: "company",
    permissions: [
      "view_company",
      "update_company_settings",
      "invite_company_member",
      "remove_company_member",
      "assign_company_role",
      "view_project",
      "create_project",
      "update_project_settings",
      "delete_project",
      "invite_project_member",
      "remove_project_member",
      "assign_project_role",
      "view_task",
      "create_task",
      "assign_task",
      "update_own_task_status",
      "update_any_task",
      "delete_task",
    ],
  },
  {
    title: "Manager",
    scope: "company",
    permissions: [
      "view_company",
      "invite_company_member",
      "view_project",
      "create_project",
      "view_task",
      "create_task",
      "assign_task",
      "update_own_task_status",
    ],
  },
  {
    title: "Member",
    scope: "company",
    permissions: [
      "view_company",
      "view_project",
      "view_task",
      "create_task",
      "update_own_task_status",
    ],
  },
  {
    title: "Guest",
    scope: "company",
    permissions: ["view_company"],
  },
  {
    title: "Owner",
    scope: "project",
    permissions: [
      "view_project",
      "update_project_settings",
      "delete_project",
      "invite_project_member",
      "remove_project_member",
      "assign_project_role",
      "view_task",
      "create_task",
      "assign_task",
      "update_own_task_status",
      "update_any_task",
      "delete_task",
    ],
  },
  {
    title: "Manager",
    scope: "project",
    permissions: [
      "view_project",
      "invite_project_member",
      "remove_project_member",
      "view_task",
      "create_task",
      "assign_task",
      "update_own_task_status",
      "update_any_task",
      "delete_task",
    ],
  },
  {
    title: "Developer",
    scope: "project",
    permissions: [
      "view_project",
      "view_task",
      "create_task",
      "update_own_task_status",
    ],
  },
  {
    title: "Viewer",
    scope: "project",
    permissions: ["view_project", "view_task"],
  },
];

async function seedRolePermissions() {
  for (const entry of rolePermissionMap) {
    const role = await prisma.role.findFirst({
      where: { title: entry.title, scope: entry.scope },
    });

    if (!role) {
      console.warn(
        `⚠️  Role not found: ${entry.title} (${entry.scope}) — skipping`,
      );
      continue;
    }

    const permissions = await prisma.permission.findMany({
      where: { name: { in: entry.permissions } },
    });

    const foundNames = permissions.map((p) => p.name);
    const missing = entry.permissions.filter((p) => !foundNames.includes(p));
    if (missing.length > 0) {
      console.warn(
        `⚠️  Missing permissions for ${entry.title} (${entry.scope}): ${missing.join(", ")}`,
      );
    }

    await prisma.rolePermission.createMany({
      data: permissions.map((p) => ({
        roleId: role.id,
        permissionId: p.id,
      })),
      skipDuplicates: true,
    });
  }

  console.log("✅ Role permissions seeded");
}

module.exports = { seedRolePermissions };
