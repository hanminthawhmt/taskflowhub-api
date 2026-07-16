const companyRepo = require("./repository");
const sendMail = require("../../services/mailer");
const companyInviteTemplate = require("../../services/emailTemplates/companyInvite");
const bcrypt = require("bcrypt");
const generateToken = require("../../util/generateToken");
const authRepo = require("../auth/repository");
const activityLogService = require("../activity_log/service");

const listCompaniesForUser = async (userId) => {
  const memberships = await companyRepo.findCompaniesForUser(userId);

  return memberships.map((m) => ({
    id: m.company.id,
    name: m.company.name,
    role: m.role.title,
    roleId: m.role.id,
    planName: m.company.plan?.name ?? null,
    subscriptionStatus: m.company.subscriptionStatus,
    createdAt: m.company.createdAt,
  }));
};

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

  await activityLogService.log({
    companyId,
    projectId: null,
    userId: invitedBy,
    action: "company_member_invited",
    subjectType: "company_member",
    subjectId: invitation.id,
    meta: {
      email,
      roleId,
      companyId,
    },
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

  const membership = await companyRepo.runTransaction(async (tx) => {
    return companyRepo.acceptInvitationInTransaction(tx, {
      invitation,
      userId,
    });
  });

  await activityLogService.log({
    companyId: invitation.companyId,
    projectId: null,
    userId,
    action: "company_member_joined",
    subjectType: "company_member",
    subjectId: invitation.id,
    meta: {
      companyId: invitation.companyId,
      roleId: invitation.roleId,
      email: invitation.email,
    },
  });

  return membership;
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

  await activityLogService.log({
    companyId: invitation.companyId,
    projectId: null,
    userId: user.id,
    action: "company_member_joined",
    subjectType: "company_member",
    subjectId: invitation.id,
    meta: {
      companyId: invitation.companyId,
      roleId: invitation.roleId,
      email: invitation.email,
    },
  });

  const token_ = generateToken(user);
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token: token_ };
};

const getInvitationDetails = async (token) => {
  const result = await companyRepo.checkInvitationStatus(token);

  if (!result) {
    throw new AppError("Invitation not found", 404);
  }

  const { invitation, userExists } = result;

  if (invitation.status !== "pending") {
    throw new AppError(
      "This invitation has already been used or cancelled",
      400,
    );
  }
  if (invitation.expiresAt && invitation.expiresAt < new Date()) {
    throw new AppError("This invitation has expired", 400);
  }

  return {
    email: invitation.email,
    companyId: invitation.companyId,
    userExists, // this is the key field the frontend branches on
  };
};

const getCompanyDetails = async (companyId) => {
  const company = await companyRepo.findCompanyDetailsById(companyId);

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return {
    id: company.id,
    name: company.name,
    subscriptionStatus: company.subscriptionStatus,
    planName: company.plan?.name ?? null,
    planId: company.planId,
    maxProjects: company.plan?.maxProjects ?? null,
    createdBy: company.creator,
    memberCount: company._count.members,
    projectCount: company._count.projects,
    trialEndsAt: company.trialEndsAt,
    createdAt: company.createdAt,
  };
};

const listCompanyMembers = async (companyId) => {
  const members = await companyRepo.findMembersForCompany(companyId);

  return members.map((m) => ({
    userId: m.user.id,
    name: m.user.name,
    email: m.user.email,
    roleId: m.role.id,
    roleTitle: m.role.title,
    joinedAt: m.createdAt,
  }));
};

module.exports = {
  createCompany,
  inviteMember,
  findCompanyById,
  getAllCompanies,
  getInvitationDetails,
  registerViaInvitation,
  acceptInvitation,
  listCompaniesForUser,
  getCompanyDetails,
  listCompanyMembers
};
