const companyRepo = require("./repository");
const sendMail = require("../../services/mailer");
const companyInviteTemplate = require("../../services/emailTemplates/companyInvite");
const bcrypt = require("bcrypt");
const generateToken = require("../../util/generateToken");
const authRepo = require("../auth/repository");
const activityLogService = require("../activity_log/service");
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const AppError = require("../../util/appError");
const { APP_URL } = require("../../config/env");

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

  const acceptUrl = `${APP_URL}/invitations/company/${invitation.token}`;

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

const updateCompanyName = async (id, name, userId) => {
  const company = await companyRepo.findCompanyById(id);
  if (!company) {
    throw new AppError("Company not found", 404);
  }
  const updatedCompany = await companyRepo.updateCompanyName(company.id, name);

  await activityLogService.log({
    companyId: company.id,
    projectId: null,
    userId,
    action: "company_updated",
    subjectType: "company",
    subjectId: company.id,
    meta: { newName: name },
  });

  return updatedCompany;
};

const getCompanyStats = async (companyId, period) => {
  let dateFilter = {};

  if (period === "week") {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    dateFilter = { gte: weekAgo };
  } else if (period === "month") {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    dateFilter = { gte: monthAgo };
  }

  const { projectCount, tasksCompleted, pendingTasks } =
    await companyRepo.getCompanyStats(companyId, dateFilter);

  const totalRelevantTasks = tasksCompleted + pendingTasks;
  const successRate =
    totalRelevantTasks > 0
      ? Math.round((tasksCompleted / totalRelevantTasks) * 100)
      : 0;

  return {
    activeProjects: projectCount,
    tasksCompleted,
    pendingTasks,
    successRate,
  };
};

const getWeeklyTaskActivity = async (companyId, fromParam, toParam) => {
  const to = toParam ? new Date(toParam) : new Date();
  const from = fromParam
    ? new Date(fromParam)
    : new Date(to.getTime() - 6 * 24 * 60 * 60 * 1000);

  const tasks = await companyRepo.getTasksInDateRange(companyId, from, to);

  // Build one bucket per day in the range, in order
  const buckets = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const endCursor = new Date(to);
  endCursor.setHours(23, 59, 59, 999);

  while (cursor <= endCursor) {
    buckets.push({
      dateKey: cursor.toISOString().slice(0, 10), // "2026-07-16"
      day: DAY_LABELS[cursor.getDay()],
      completed: 0,
      created: 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const bucketByDateKey = Object.fromEntries(
    buckets.map((b) => [b.dateKey, b]),
  );

  for (const task of tasks) {
    const createdKey = task.createdAt.toISOString().slice(0, 10);
    if (bucketByDateKey[createdKey]) {
      bucketByDateKey[createdKey].created += 1;
    }

    if (task.status === "complete") {
      const updatedKey = task.updatedAt.toISOString().slice(0, 10);
      if (bucketByDateKey[updatedKey]) {
        bucketByDateKey[updatedKey].completed += 1;
      }
    }
  }

  return buckets.map(({ dateKey, ...rest }) => rest); // drop internal dateKey from response
};

const listPendingInvitations = async (companyId) => {
  const invitations = await companyRepo.findPendingInvitations(companyId);

  return invitations.map((inv) => ({
    id: inv.id,
    email: inv.email,
    roleId: inv.role.id,
    roleTitle: inv.role.title,
    invitedBy: inv.inviter,
    expiresAt: inv.expiresAt,
    createdAt: inv.createdAt,
  }));
};

const revokeInvitation = async (invitationId, companyId) => {
  const invitation = await companyRepo.findInvitationById(invitationId);

  if (!invitation || invitation.companyId !== companyId) {
    throw new AppError("Invitation not found", 404);
  }
  if (invitation.status !== "pending") {
    throw new AppError("This invitation is no longer pending", 400);
  }

  return companyRepo.revokeInvitation(invitationId);
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
  listCompanyMembers,
  updateCompanyName,
  getCompanyStats,
  getWeeklyTaskActivity,
  listPendingInvitations,
  revokeInvitation
};
