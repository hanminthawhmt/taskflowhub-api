const AppError = require("../util/appError");

const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user || user.platformRole !== "super_admin") {
      throw new AppError("Super admin access required", 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireSuperAdmin };
