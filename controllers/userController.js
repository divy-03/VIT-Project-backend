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
    
})