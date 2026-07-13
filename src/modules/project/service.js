const projectRepo = require("./repository");
const roleService = require("../role/service");
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

module.exports = { createProject, addProjectMembers };
