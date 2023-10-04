const catchAsyncErrors = require("../middleware/catchAsyncErrors");
// const ErrorHandler = require("../utils/errorHandler");
const { check, validationResult } = require("express-validator");
const crypto = require("crypto");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const resError = require("../tools/resError");
const resSuccess = require("../tools/resSuccess");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: secPass,
    avatar: {
      public_id: "This is a sample id",
      url: "https://picsum.photos/200/200",
    },
  });

  return sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  await check("email", "Please enter a valid email").isEmail().run(req);
  await check("password", "Please enter a password").notEmpty().run(req);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resError(400, errors.array(), res);
  } else {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return resError(401, "Invalid email or password", res);
    }

    const savedPassword = user.password;

    const passwordCompare = await bcrypt.compare(password, savedPassword);

    if (!passwordCompare) {
      return resError(401, "Password not matched", res);
    } else {
      return sendToken(user, 200, res);
    }
  }
});

// Logout User
exports.logOutUser = catchAsyncErrors(async (req, res) => {
  res.cookie("authToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  resSuccess(200, "Logged Out Successfully", res);
});

exports.forgotPassword = catchAsyncErrors(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return resError(404, "User not found", res);
  }

  // Get resetPasswordToken
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset link is => \n\n ${resetPasswordUrl} \n\nIf you have not requested to reset password then please ignore this mail`;

  try {
    await sendEmail({
      email: user.email,
      subject: "VitXchange Password Recovery",
      message: message,
      html: `<div style="background-image: linear-gradient(to right bottom, #ae95ffab 40%, rgb(210, 103, 117, 0.4)); margin:0;">
        <h1 style="color: #333; margin-left: 10px;">Password Reset Link</h1>
        <p style="font-size: 16px; margin-left:20px;">Click this link below to reset your password of VitXchange Website</p>
        <a href="${resetPasswordUrl}" style="text-decoration: none; background: black; color: white; border-radius: 8px; padding: 10px; text-align: center; width: 80px; margin-left: 50px; transition: background 0.3s;" onmouseover="this.style.background='rgb(45 45 45)'"
        onmouseout="this.style.background='black'">Click Here!</a>
        <p style="font-size: 16px; margin-left:20px;">If you didn't requested to reset password then please ignore this mail</p>
  </div>`,
    });

    resSuccess(200, `Email sent to ${user.email}`, res);
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save({ validateBeforeSave: false });

    return resError(500, error.stack, res);
  }
});

