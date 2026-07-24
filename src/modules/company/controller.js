const companyService = require("./service");
const authService = require("../auth/service");

const handleInviteMember = async (req, res, next) => {
  try {
    const inviter = await authService.getUserById(Number(req.user.userId));
    const company = await companyService.findCompanyById(
      Number(req.params.companyId),
    );
    const invitation = await companyService.inviteMember({
      companyId: Number(req.params.companyId),
      email: req.body.email,
      roleId: req.body.role_id,
      invitedBy: req.user.userId,
      companyName: company.name,
      inviterName: inviter.name,
    });
    res.status(201).json({ message: "Invitation sent", data: invitation });
  } catch (error) {
    next(error);
  }
};

const handleGetAllCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json({
      data: companies,
    });
  } catch (error) {
    next(error);
  }
};

const handleAcceptInvitation = async (req, res, next) => {
  try {
    const membership = await companyService.acceptInvitation({
      token: req.params.token,
      userId: req.user.userId,
      userEmail: req.user.email,
    });
    res.status(200).json({ message: "Invitation accepted", data: membership });
  } catch (error) {
    next(error);
  }
};

const handleRegisterViaInvitation = async (req, res, next) => {
  try {
    const { user, token } = await companyService.registerViaInvitation({
      token: req.params.token,
      name: req.body.name,
      password: req.body.password,
    });
    res.status(201).json({
      message: "Account created and invitation accepted",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const handleGetInvitationDetails = async (req, res, next) => {
  try {
    const details = await companyService.getInvitationDetails(req.params.token);
    res.status(200).json({ data: details });
  } catch (error) {
    next(error);
  }
};

const handleListCompanies = async (req, res, next) => {
  try {
    const companies = await companyService.listCompaniesForUser(
      req.user.userId,
    );
    res.status(200).json({ data: companies });
  } catch (error) {
    next(error);
  }
};

const handleGetCompanyDetails = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyDetails(
      Number(req.params.companyId),
    );
    res.status(200).json({ data: company });
  } catch (error) {
    next(error);
  }
};

const handleListMembers = async (req, res, next) => {
  try {
    const members = await companyService.listCompanyMembers(
      Number(req.params.companyId),
    );
    res.status(200).json({ data: members });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCompanyName = async (req, res, next) => {
  try {
    const company = await companyService.updateCompanyName(
      Number(req.params.companyId),
      req.body.name,
      req.user.userId,
    );
    res
      .status(200)
      .json({ message: "Company name updated successfully", data: company });
  } catch (error) {
    next(error);
  }
};

const handleGetCompanyStats = async (req, res, next) => {
  try {
    const stats = await companyService.getCompanyStats(
      Number(req.params.companyId),
      req.query.period,
    );
    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
};

const handleGetWeeklyActivity = async (req, res, next) => {
  try {
    const activity = await companyService.getWeeklyTaskActivity(
      Number(req.params.companyId),
      req.query.from,
      req.query.to,
    );
    res.status(200).json({ data: activity });
  } catch (error) {
    next(error);
  }
};

const handleListPendingInvitations = async (req, res, next) => {
  try {
    const invitations = await companyService.listPendingInvitations(
      Number(req.params.companyId),
    );
    res.status(200).json({ data: invitations });
  } catch (error) {
    next(error);
  }
};

const handleRevokeInvitation = async (req, res, next) => {
  try {
    await companyService.revokeInvitation(
      Number(req.params.invitationId),
      Number(req.params.companyId),
    );
    res.status(200).json({ message: "Invitation revoked" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleInviteMember,
  handleGetAllCompanies,
  handleAcceptInvitation,
  handleRegisterViaInvitation,
  handleGetInvitationDetails,
  handleListCompanies,
  handleGetCompanyDetails,
  handleListMembers,
  handleUpdateCompanyName,
  handleGetCompanyStats,
  handleGetWeeklyActivity,
  handleListPendingInvitations,
  handleRevokeInvitation
};
