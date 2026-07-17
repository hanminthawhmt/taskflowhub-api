const usersService = require("./service");

const handleUpdateProfile = async (req, res, next) => {
  try {
    const user = await usersService.updateProfile(req.user.userId, req.body);
    res
      .status(200)
      .json({ message: "Profile updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};

const handleUpdatePassword = async (req, res, next) => {
  try {
    await usersService.updatePassword(req.user.userId, req.body);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

const handleGetProfile = async (req, res, next) => {
  try {
    const user = await usersService.getProfileData(req.user.userId);
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleUpdateProfile,
  handleUpdatePassword,
  handleGetProfile,
};
