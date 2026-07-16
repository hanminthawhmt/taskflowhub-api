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

module.exports = { handleUpdateProfile };
