const permissionService = require("./service");

const handleGetAllPermissions = async (req, res, next) => {
  try {
    const permissions = await permissionService.getAllPermission();
    res.status(200).json({
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
};

const handleCreatePermission = async (req, res, next) => {
  try {
    const permission = await permissionService.createPermission(req.body);
    res.status(201).json({
      message: "A new permission has been successfully added.",
      data: permission,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { handleGetAllPermissions, handleCreatePermission };
