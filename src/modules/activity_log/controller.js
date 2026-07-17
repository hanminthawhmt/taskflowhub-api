const activityLogService = require("./service");

const handleGetAllActivity = async (req, res, next) => {
  try {
    const logs = await activityLogService.getAllActivity(
      Number(req.query.limit) || 50,
    );
    res.status(200).json({ data: logs });
  } catch (error) {
    next(error);
  }
};

const handleGetCompanyActivity = async (req, res, next) => {
  try {
    const result = await activityLogService.getCompanyActivity(
      Number(req.params.companyId),
      req.query.page,
      req.query.limit,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { handleGetAllActivity, handleGetCompanyActivity };
