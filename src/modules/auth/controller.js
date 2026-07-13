const authService = require("./service");

const handleLogIn = async (req, res, next) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.status(200).json({
      message: "Login Successful",
      data: user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const handleRegister = async (req, res, next) => {
  try {
    const { user, company, token } = await authService.registerUser(req.body);
    res.status(201).json({
      message: "User Registered",
      data: [
        {
          user: user,
          company: company,
        },
      ],
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogIn,
  handleRegister,
};
