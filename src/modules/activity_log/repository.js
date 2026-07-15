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

const findRecentForCompany = (companyId, limit = 20) => {
  return prisma.activityLog.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { id: true, name: true, email: true } } },
  });
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
};
