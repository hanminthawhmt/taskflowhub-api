const projectService = require("./service");

const handleCreateProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject({
      company_id: Number(req.params.companyId),
      title: req.body.title,
      description: req.body.description,
      userId: req.user.userId,
    });
    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const handleAddProjectMembers = async (req, res, next) => {
  try {
    const members = await projectService.addProjectMembers({
      projectId: Number(req.params.projectId),
      members: req.body.members,
    });
    res.status(201).json({
      message: "Members added successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleCreateProject, handleAddProjectMembers };
