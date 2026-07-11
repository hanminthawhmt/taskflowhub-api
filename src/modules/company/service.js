const companyRepo = require("./repository");

const createCompany = async (tx, { companyName, userId, ownerRoleId }) => {
  return companyRepo.createCompanyAsOwner(tx, {
    companyName,
    userId,
    ownerRoleId,
  });
};

module.exports = { createCompany };
