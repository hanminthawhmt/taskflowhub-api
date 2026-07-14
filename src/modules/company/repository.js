const prisma = require("../../config/db");
const crypto = require("crypto");

const createCompanyAsOwner = async (
  tx,
  { companyName, userId, ownerRoleId },
) => {
  const company = await tx.company.create({
    data: {
      name: companyName,
      createdBy: userId,
      subscriptionStatus: "active",
    },
  });

  await tx.companyMember.create({
    data: {
      companyId: company.id,
      userId,
      roleId: ownerRoleId,
    },
  });
  return company;
};

const createInvitation = (tx, { companyId, email, roleId, invitedBy }) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return tx.companyInvitation.create({
    data: {
      companyId,
      email,
      roleId,
      token,
      status: "pending",
      invitedBy,
      expiresAt,
    },
  });
};

const findInvitationByToken = async (token) => {
  return await prisma.companyInvitation.findFirst({ where: { token } });
};

const markInvitationAccepted = async (id) => {
  return await prisma.companyInvitation.update({
    where: { id },
    data: { status: "accepted", acceptedAt: new Date() },
  });
};

const runTransaction = (callback) => {
  return prisma.$transaction(callback);
};

const findCompanyById = async (id) => {
  return await prisma.company.findUnique({
    where: { id },
  });
};

const getAllCompanies = async () => {
  return await prisma.company.findMany();
};

const acceptInvitationInTransaction = async (tx, { invitation, userId }) => {
  await tx.companyMember.create({
    data: {
      companyId: invitation.companyId,
      userId,
      roleId: invitation.roleId,
    },
  });

  return tx.companyInvitation.update({
    where: { id: invitation.id },
    data: { status: "accepted", acceptedAt: new Date() },
  });
};

const createUserForInvitation = (tx, { name, email, password }) => {
  return tx.user.create({ data: { name, email, password } });
};

const checkInvitationStatus = async (token) => {
  const invitation = await prisma.companyInvitation.findFirst({
    where: { token },
  });
  if (!invitation) return null;

  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
  });

  return { invitation, userExists: !!existingUser };
};

module.exports = {
  createCompanyAsOwner,
  createInvitation,
  findInvitationByToken,
  markInvitationAccepted,
  runTransaction,
  findCompanyById,
  getAllCompanies,
  acceptInvitationInTransaction,
  createUserForInvitation,
  checkInvitationStatus,
};
