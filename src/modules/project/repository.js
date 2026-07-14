const prisma = require("../../config/db");
const crypto = require("crypto");
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

const createInvitationInTransaction = (
  tx,
  { projectId, email, roleId, invitedBy },
) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  return tx.projectInvitation.create({
    data: {
      projectId,
      email,
      roleId,
      token,
      status: "pending",
      invitedBy,
      expiresAt,
    },
  });
};

const findInvitationByToken = (token) => {
  return prisma.projectInvitation.findFirst({ where: { token } });
};

const markInvitationAccepted = (id) => {
  return prisma.projectInvitation.update({
    where: { id },
    data: { status: "accepted", acceptedAt: new Date() },
  });
};

const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id },
  });
};

const acceptInvitationInTransaction = async (tx, { invitation, userId }) => {
  await tx.projectMember.create({
    data: {
      projectId: invitation.projectId,
      userId,
      roleId: invitation.roleId,
    },
  });

  return tx.projectInvitation.update({
    where: { id: invitation.id },
    data: { status: "accepted", acceptedAt: new Date() },
  });
};

module.exports = {
  createProjectInTransaction,
  addProjectMemberInTransaction,
  runTransaction,
  addMembersInTransaction,
  createInvitationInTransaction,
  findInvitationByToken,
  markInvitationAccepted,
  getProjectById,
  acceptInvitationInTransaction,
};
