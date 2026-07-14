const projectService = require("./service");
const authService = require("../auth/service");

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

const handleInviteProjectMember = async (req, res, next) => {
  try {
    const inviter = await authService.getUserById(req.user.userId);
    const project = await projectService.findProjectById(
      Number(req.params.projectId),
    ); // reuse req.invitedUser? no need — email/roleId is enough

    const invitation = await projectService.inviteMember({
      projectId: Number(req.params.projectId),
      email: req.body.email,
      roleId: req.body.role_id,
      invitedBy: req.user.userId,
      projectTitle: project.title,
      inviterName: inviter.name,
    });

    res.status(201).json({ message: "Invitation sent", data: invitation });
  } catch (error) {
    next(error);
  }
};

const handleAcceptInvitation = async (req, res, next) => {
  try {
    const membership = await projectService.acceptInvitation({
      token: req.params.token,
      userId: req.user.userId,
      userEmail: req.user.email,
    });
    res.status(200).json({ message: "Invitation accepted", data: membership });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProject,
  handleAddProjectMembers,
  handleInviteProjectMember,
  handleAcceptInvitation,
};
