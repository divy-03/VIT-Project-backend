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
const cloudinary = require("cloudinary");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: secPass,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
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
  )}/api/password/reset/${resetToken}`;

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

exports.resetPassword = catchAsyncErrors(async (req, res) => {
  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return resError(400, "Reset Password link is invalid or expired", res);
  }

  if (req.body.password !== req.body.confirmPassword) {
    return resError(400, "Password doesn't match", res);
  }

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);

  user.password = secPass;

  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res) => {
  const user = await User.findOne(req.user._id);

  return res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res) => {
  const user = await User.findOne(req.user._id).select("+password");

  const passwordCompare = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!passwordCompare) {
    return resError(401, "Password not matched", res);
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return resError(401, "New password not matched", res);
  }

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.newPassword, salt);

  user.password = secPass;

  await user.save();

  return sendToken(user, 200, res);
});

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // TODO: add cloudinary later for avatar image

  await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  });

  resSuccess(200, "Profile updated successfully", res);
});

// Get All Users --- ADMIN
exports.getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    usersCount: users.length,
    users: users,
  });
});

// Get Single User Information --- ADMIN
exports.getUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return resError(404, `User not found with id: ${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

// Edit User Profile and role --- ADMIN
exports.editUserRole = catchAsyncErrors(async (req, res) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  if (!user) {
    return resError(404, "User not found", res);
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

// Delete User --- ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.params.id);

  // TODO: remove cloudinary later

  if (user === null) {
    return resError(404, `User not found`, res);
  }
  await user.deleteOne();

  resSuccess(200, `User with id: ${req.params.id} deleted successfully`, res);
});
