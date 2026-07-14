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

module.exports = {
  handleInviteMember,
  handleGetAllCompanies,
  handleAcceptInvitation,
  handleRegisterViaInvitation,
  handleGetInvitationDetails
};
