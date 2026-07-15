const activityLogRepo = require("./repository");

const log = async (params) => {
  try {
    await activityLogRepo.createLog(params);
  } catch (error) {
    // Logging failures should never break the actual business operation
    console.error("Failed to write activity log:", error);
  }
};

const getCompanyActivity = (companyId, limit) => {
  return activityLogRepo.findRecentForCompany(companyId, limit);
};

const getProjectActivity = (projectId, limit) => {
  return activityLogRepo.findRecentForProject(projectId, limit);
};

const getAllActivity = (limit) => {
  return activityLogRepo.findAllRecent(limit);
};

module.exports = {
  log,
  getCompanyActivity,
  getProjectActivity,
  getAllActivity,
};
