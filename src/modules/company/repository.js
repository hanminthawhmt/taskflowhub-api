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

const findInvitationByToken = (token) => {
  return prisma.companyInvitation.findFirst({ where: { token } });
};

const markInvitationAccepted = (id) => {
  return prisma.companyInvitation.update({
    where: { id },
    data: { status: "accepted", acceptedAt: new Date() },
  });
};

const runTransaction = (callback) => {
  return prisma.$transaction(callback);
};

const findCompanyById = (id) => {
  return prisma.company.findUnique({
    where: { id },
  });
};

module.exports = {
  createCompanyAsOwner,
  createInvitation,
  findInvitationByToken,
  markInvitationAccepted,
  runTransaction,
  findCompanyById,
};
