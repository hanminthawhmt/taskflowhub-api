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

module.exports = {
  createProjectInTransaction,
  addProjectMemberInTransaction,
  runTransaction,
};
