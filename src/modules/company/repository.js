const prisma = require("../../config/db");

const createCompanyAsOwner = async (
  tx,
  { companyName, userId, ownerRoleId },
) => {
  const company = tx.company.create({
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

module.exports = { createCompanyAsOwner };
