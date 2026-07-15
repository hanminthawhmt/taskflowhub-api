const authRepo = require("./repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../util/appError");
const generateToken = require("../../util/generateToken");
const roleService = require("../role/service");
const companyService = require("../company/service");
const activityLogService = require("../activity_log/service");

const registerUser = async ({ name, email, password, companyName }) => {
  const existingUser = await authRepo.findByEmail(email);
  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }
  const onwerRole = await roleService.getOwnerRole("Owner", "company");
  const hashedPassword = await bcrypt.hash(password, 10);

  const { user, company } = await authRepo.runTransaction(async (tx) => {
    const user = await authRepo.createUserInTransaction(tx, {
      name,
      email,
      password: hashedPassword,
    });

    const company = await companyService.createCompany(tx, {
      companyName,
      userId: user.id,
      ownerRoleId: onwerRole.id,
    });

    return { user, company };
  });

  await activityLogService.log({
    companyId: company.id,
    projectId: null,
    userId: user.id,
    action: "company_created",
    subjectType: "company",
    subjectId: company.id,
    meta: {
      companyName,
    },
  });

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    company,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await authRepo.findByEmail(email);
  if (!user) {
    throw new AppError("User does not exist", 401);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  const token = generateToken(user);
  const { password: _, ...safeUser } = user;
  return {
    user: safeUser,
    token,
  };
};

const getUserById = async (id) => {
  return await authRepo.getUserById(id);
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
