const projectRepo = require("./repository");
const roleService = require("../role/service");
const projectInviteTemplate = require("../../services/emailTemplates/projectInvite");
const sendMail = require("../../services/mailer");
const AppError = require("../../util/appError");

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

    return project;
  } catch (error) {
    throw new AppError(
      error.message || "Failed to create project",
      error.statusCode || 500,
    );
  }
};

const addProjectMembers = async ({ projectId, members }) => {
  const addedMembers = await projectRepo.runTransaction(async (tx) => {
    return projectRepo.addMembersInTransaction(tx, { projectId, members });
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

  const acceptUrl = `http://localhost:3000/api/v1/companies/projects/invitations/${invitation.token}/accept`;

  await sendMail({
    to: email,
    subject: `You're invited to join ${projectTitle}`,
    html: projectInviteTemplate({ projectTitle, inviterName, acceptUrl }),
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

  return projectRepo.runTransaction(async (tx) => {
    return projectRepo.acceptInvitationInTransaction(tx, {
      invitation,
      userId,
    });
  });
};

module.exports = {
  createProject,
  addProjectMembers,
  inviteMember,
  findProjectById,
  acceptInvitation,
};
