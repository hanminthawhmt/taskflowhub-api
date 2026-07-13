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

module.exports = {
  createCompanyAsOwner,
  createInvitation,
  findInvitationByToken,
  markInvitationAccepted,
  runTransaction,
  findCompanyById,
  getAllCompanies,
};
