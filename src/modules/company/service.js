const companyRepo = require("./repository");
const sendMail = require("../../services/mailer");
const companyInviteTemplate = require("../../services/emailTemplates/companyInvite");
const bcrypt = require('bcrypt');
const generateToken = require('../../util/generateToken');
const authRepo = require('../auth/repository');

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

  const acceptUrl = `http://localhost:3000/api/v1/companies/invitations/${invitation.token}/accept`;

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

const validateInvitation = async (token, expectedEmail = null) => {
  const invitation = await companyRepo.findInvitationByToken(token);

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

  if (expectedEmail && invitation.email !== expectedEmail) {
    throw new AppError("This invitation was not issued to your account", 403);
  }

  return invitation;
};

// Path A — existing user, already authenticated
const acceptInvitation = async ({ token, userId, userEmail }) => {
  const invitation = await validateInvitation(token, userEmail);

  return companyRepo.runTransaction(async (tx) => {
    return companyRepo.acceptInvitationInTransaction(tx, {
      invitation,
      userId,
    });
  });
};

// Path B — brand new user, no account yet
const registerViaInvitation = async ({ token, name, password }) => {
  const invitation = await validateInvitation(token);

  const existingUser = await authRepo.findByEmail(invitation.email);
  if (existingUser) {
    throw new AppError(
      "An account with this email already exists — please log in instead",
      409,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { user } = await companyRepo.runTransaction(async (tx) => {
    const user = await companyRepo.createUserForInvitation(tx, {
      name,
      email: invitation.email,
      password: hashedPassword,
    });
    await companyRepo.acceptInvitationInTransaction(tx, {
      invitation,
      userId: user.id,
    });
    return { user };
  });

  const token_ = generateToken(user);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token: token_ };
};

module.exports = {
  createCompany,
  inviteMember,
  findCompanyById,
  getAllCompanies,
};
