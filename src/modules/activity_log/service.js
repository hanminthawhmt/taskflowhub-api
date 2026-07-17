const activityLogRepo = require("./repository");

const log = async (params) => {
  try {
    await activityLogRepo.createLog(params);
  } catch (error) {
    // Logging failures should never break the actual business operation
    console.error("Failed to write activity log:", error);
  }
};

const getCompanyActivity = async (companyId, page, limit) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 10;

  const [logs, total] = await Promise.all([
    activityLogRepo.findRecentForCompany(companyId, pageNum, limitNum),
    activityLogRepo.countForCompany(companyId),
  ]);

  const data = logs.map((log) => ({
    id: log.id,
    userId: log.userId,
    userName: log.user?.name ?? "Unknown user",
    action: log.action,
    target: log.subjectType && log.meta?.title ? log.meta.title : null,
    createdAt: log.createdAt,
  }));

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
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
