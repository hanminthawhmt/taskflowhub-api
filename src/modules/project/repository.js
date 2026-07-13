const prisma = require("../../config/db");

const createProjectInTransaction = async (
  tx,
  { company_id, title, description, created_by },
) => {
  return tx.project.create({
    data: {
      companyId: company_id,
      title,
      description,
      createdBy: created_by,
    },
  });
};

const addProjectMemberInTransaction = async (
  tx,
  { projectId, userId, roleId },
) => {
  return tx.projectMember.create({
    data: {
      projectId,
      userId,
      roleId,
    },
  });
};

const runTransaction = (callback) => {
  return prisma.$transaction(callback);
};

const addMembersInTransaction = async (tx, { projectId, members }) => {
  const data = members.map((m) => ({
    projectId,
    userId: m.user_id,
    roleId: m.role_id,
  }));

  await tx.projectMember.createMany({
    data,
    skipDuplicates: true,
  });

  return tx.projectMember.findMany({
    where: {
      projectId,
      userId: { in: members.map((m) => m.user_id) },
    },
  });
};

module.exports = {
  createProjectInTransaction,
  addProjectMemberInTransaction,
  runTransaction,
  addMembersInTransaction,
};
