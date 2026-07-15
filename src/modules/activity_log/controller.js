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

module.exports = { handleGetAllActivity };
