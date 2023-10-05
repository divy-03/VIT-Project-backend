const userModel = require("../models/userModel");
const resError = require("../tools/resError");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.fetchUser = catchAsyncErrors(async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return resError(401, "Please authenticate using a valid token", res);
  }

  const data = jwt.verify(authToken, process.env.JWT_SECRET);

  req.user = await userModel.findById(data.user.id);

  next();
});

exports.authRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return resError(
        403,
        `Role: ${req.user.role} is not allowed to access this resource`,
        res
      );
    }
    next();
  };
};
