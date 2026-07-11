const projectRepo = require("./repository");
const roleService = require("../role/service");
const { projectMember } = require("../../config/db");
const createProject = async ({ company_id, title, description }, userId) => {
  const ownerRole = await roleService.getOwnerRole("Owner", "project");
  const { project } = await projectRepo.runTransaction(async (tx) => {
    const project = await projectRepo.createProjectInTransaction(tx, {
      company_id,
      title,
      description,
      userId,
    });
    await projectRepo.addProjectMemberInTransaction(tx, {
      projectId: project.id,
      userId,
      roleId: ownerRole.id,
    });
  });
};

module.exports = { createProject };
