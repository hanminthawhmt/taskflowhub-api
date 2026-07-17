const prisma = require("../../config/db");

const createLog = ({
  companyId,
  projectId,
  userId,
  action,
  subjectType,
  subjectId,
  meta,
}) => {
  return prisma.activityLog.create({
    data: {
      companyId: companyId ?? null,
      projectId: projectId ?? null,
      userId,
      action,
      subjectType: subjectType ?? null,
      subjectId: subjectId ?? null,
      meta: meta ?? null,
    },
  });
};

const findRecentForCompany = (companyId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  return prisma.activityLog.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const countForCompany = (companyId) => {
  return prisma.activityLog.count({ where: { companyId } });
};

const findRecentForProject = (projectId, limit = 20) => {
  return prisma.activityLog.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

const findAllRecent = (limit = 50) => {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
};

module.exports = {
  createLog,
  findRecentForCompany,
  findRecentForProject,
  findAllRecent,
  countForCompany,
};
