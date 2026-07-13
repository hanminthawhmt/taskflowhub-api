const companyRepo = require("./repository");
const sendEmail = require("../../services/mailer");
const companyInviteTemplate = require("../../services/emailTemplates/companyInvite");

const createCompany = async (tx, { companyName, userId, ownerRoleId }) => {
  return companyRepo.createCompanyAsOwner(tx, {
    companyName,
    userId,
    ownerRoleId,
  });
};

const inviteMember = async ({
  companyId,
  email,
  roleId,
  invitedBy,
  companyName,
  inviterName,
}) => {
  const invitation = await companyRepo.runTransaction(async (tx) => {
    return companyRepo.createInvitation(tx, {
      companyId,
      email,
      roleId,
      invitedBy,
    });
  });

  const acceptUrl = `${APP_URL}/api/v1/companies/invitations/${invitation.token}/accept`;

  await sendMail({
    to: email,
    subject: `You're invited to join ${companyName}`,
    html: companyInviteTemplate({ companyName, inviterName, acceptUrl }),
  });

  return invitation;
};

const findCompanyById = async (id) => {
  return await companyRepo.findCompanyById(id);
};

const getAllCompanies = async () => {
  return await companyRepo.getAllCompanies();
};

module.exports = {
  createCompany,
  inviteMember,
  findCompanyById,
  getAllCompanies,
};
