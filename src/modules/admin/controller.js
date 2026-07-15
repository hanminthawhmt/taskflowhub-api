const adminService = require("./service");

const handlePromoteSuperAdmin = async (req, res, next) => {
  try {
    const user = await adminService.promoteToSuperAdmin(req.body.user_id);
    res
      .status(200)
      .json({ message: "User promoted to super admin", data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { handlePromoteSuperAdmin };
