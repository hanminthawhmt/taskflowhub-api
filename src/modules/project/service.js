const projectRepo = require("./repository");
const roleService = require("../role/service");
const projectInviteTemplate = require("../../services/emailTemplates/projectInvite");
const sendMail = require("../../services/mailer");
const AppError = require("../../util/appError");
const activityLogService = require("../activity_log/service");
const { APP_URL } = require("../../config/env");

const listProjectsForCompany = async (companyId, userId) => {
  const projects = await projectRepo.findProjectsForCompanyAndUser(
    companyId,
    userId,
  );

  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    memberCount: p._count.members,
    taskCount: p._count.tasks,
    createdAt: p.createdAt,
  }));
};

const createProject = async ({ company_id, title, description, userId }) => {
  try {
    const ownerRole = await roleService.getOwnerRole("Owner", "project");

    const project = await projectRepo.runTransaction(async (tx) => {
      const project = await projectRepo.createProjectInTransaction(tx, {
        company_id,
        title,
        description,
        created_by: userId,
      });

      await projectRepo.addProjectMemberInTransaction(tx, {
        projectId: project.id,
        userId,
        roleId: ownerRole.id,
      });

      return project;
    });

    await activityLogService.log({
      companyId: company_id,
      projectId: project.id,
      userId,
      action: "project_created",
      subjectType: "project",
      subjectId: project.id,
      meta: {
        title,
        description,
      },
    });

    return project;
  } catch (error) {
    throw new AppError(
      error.message || "Failed to create project",
      error.statusCode || 500,
    );
  }
};

const addProjectMembers = async ({ projectId, members, userId }) => {
  const addedMembers = await projectRepo.runTransaction(async (tx) => {
    return projectRepo.addMembersInTransaction(tx, { projectId, members });
  });

  await activityLogService.log({
    companyId: null,
    projectId,
    userId,
    action: "project_member_added",
    subjectType: "project_member",
    subjectId: projectId,
    meta: {
      addedMemberIds: members.map((member) => member.user_id),
      addedMemberCount: members.length,
    },
  });

  return addedMembers;
};

const inviteMember = async ({
  projectId,
  email,
  roleId,
  invitedBy,
  projectTitle,
  inviterName,
}) => {
  const invitation = await projectRepo.runTransaction(async (tx) => {
    return projectRepo.createInvitationInTransaction(tx, {
      projectId,
      email,
      roleId,
      invitedBy,
    });
  });

  const acceptUrl = `${APP_URL}/invitations/project/${projectId}/${invitation.token}`;

  await sendMail({
    to: email,
    subject: `You're invited to join ${projectTitle}`,
    html: projectInviteTemplate({ projectTitle, inviterName, acceptUrl }),
  });

  await activityLogService.log({
    companyId: null,
    projectId,
    userId: invitedBy,
    action: "project_member_invited",
    subjectType: "project_member",
    subjectId: invitation.id,
    meta: {
      email,
      roleId,
      projectId,
    },
  });

  return invitation;
};

const findProjectById = async (id) => {
  return await projectRepo.getProjectById(id);
};

const acceptInvitation = async ({ token, userId, userEmail }) => {
  const invitation = await projectRepo.findInvitationByToken(token);

  if (!invitation) {
    throw new AppError("Invitation not found", 404);
  }
  if (invitation.status !== "pending") {
    throw new AppError(
      "This invitation has already been used or cancelled",
      400,
    );
  }
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    throw new AppError("This invitation has expired", 400);
  }
  if (invitation.email !== userEmail) {
    throw new AppError("This invitation was not issued to your account", 403);
  }

  const membership = await projectRepo.runTransaction(async (tx) => {
    return projectRepo.acceptInvitationInTransaction(tx, {
      invitation,
      userId,
    });
  });

  await activityLogService.log({
    companyId: null,
    projectId: invitation.projectId,
    userId,
    action: "project_member_joined",
    subjectType: "project_member",
    subjectId: invitation.id,
    meta: {
      projectId: invitation.projectId,
      roleId: invitation.roleId,
      email: invitation.email,
    },
  });

  return membership;
};

const listProjectMembers = async (projectId) => {
  const members = await projectRepo.findMembersForProject(projectId);

  return members.map((m) => ({
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    roleId: m.role.id,
    roleTitle: m.role.title,
    joinedAt: m.createdAt,
  }));
};

const updateProjectSettings = async (projectId, { title, description }) => {
  const project = await projectRepo.getProjectById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const data = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;

  return projectRepo.updateProject(projectId, data);
};

const deleteProject = async (projectId) => {
  const project = await projectRepo.getProjectById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return projectRepo.runTransaction(async (tx) => {
    return projectRepo.deleteProjectInTransaction(tx, projectId);
  });
};

module.exports = {
  createProject,
  addProjectMembers,
  inviteMember,
  findProjectById,
  acceptInvitation,
  listProjectsForCompany,
  listProjectMembers,
  updateProjectSettings,
  deleteProject,
};
