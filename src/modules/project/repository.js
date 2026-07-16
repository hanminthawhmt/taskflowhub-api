const prisma = require("../../config/db");
const crypto = require("crypto");

const findProjectsForCompanyAndUser = (companyId, userId) => {
  return prisma.project.findMany({
    where: {
      companyId,
      members: {
        some: { userId },
      },
    },
    include: {
      _count: {
        select: { members: true, tasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

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

const updateProject = (id, data) => {
  return prisma.project.update({
    where: { id },
    data,
  });
};

const acceptInvitationInTransaction = async (tx, { invitation, userId }) => {
  const existing = await tx.projectMember.findFirst({
    where: { projectId: invitation.projectId, userId },
  });

  if (existing) {
    await tx.projectMember.update({
      where: { id: existing.id },
      data: { roleId: invitation.roleId },
    });
  } else {
    await tx.projectMember.create({
      data: {
        projectId: invitation.projectId,
        userId,
        roleId: invitation.roleId,
      },
    });
  }

  return tx.projectInvitation.update({
    where: { id: invitation.id },
    data: { status: "accepted", acceptedAt: new Date() },
  });
};

const findMembersForProject = (projectId) => {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      role: true,
    },
    orderBy: { createdAt: "asc" },
  });
};

const deleteProjectInTransaction = async (tx, projectId) => {
  await tx.task.deleteMany({ where: { projectId } });
  await tx.projectInvitation.deleteMany({ where: { projectId } });
  await tx.projectMember.deleteMany({ where: { projectId } });
  return tx.project.delete({ where: { id: projectId } });
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
  findProjectsForCompanyAndUser,
  findMembersForProject,
  updateProject,
  deleteProjectInTransaction,
};
