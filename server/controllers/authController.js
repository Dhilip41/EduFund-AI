const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// @desc   Register new student
// @route  POST /api/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const otp = generateOtp();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  const user = await User.create({
    name,
    email,
    password,
    otp,
    otpExpires,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your account - OTP",
      html: `<p>Hello ${user.name},</p><p>Your OTP for account verification is:</p><h2>${otp}</h2><p>This OTP expires in 10 minutes.</p>`,
    });
  } catch (err) {
    console.warn("Email sending failed (check SMTP config):", err.message);
  }

  res.status(201).json({
    success: true,
    message: "Registration successful. Please verify your email with the OTP sent.",
    userId: user._id,
  });
});

// @desc   Verify OTP
// @route  POST /api/auth/verify-otp
// @access Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Account verified successfully",
    token: generateToken(user._id, user.role),
  });
});

// @desc   Login user (student or admin)
// @route  POST /api/auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Please verify your email before logging in");
  }

  res.json({
    success: true,
    token: generateToken(user._id, user.role),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
    },
  });
});

// @desc   Forgot password - send reset link/token
// @route  POST /api/auth/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("No account found with this email");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password (valid for 30 minutes):</p><a href="${resetUrl}">${resetUrl}</a>`,
    });
  } catch (err) {
    console.warn("Email sending failed:", err.message);
  }

  res.json({ success: true, message: "Password reset email sent" });
});

// @desc   Reset password
// @route  POST /api/auth/reset-password/:token
// @access Public
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful. Please login." });
});

// @desc   Get logged in user's profile
// @route  GET /api/profile
// @access Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ success: true, user });
});

// @desc   Update profile
// @route  PUT /api/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const updatableFields = [
    "name",
    "phone",
    "familyIncome",
    "category",
    "gender",
    "state",
    "district",
    "college",
    "department",
    "cgpa",
    "twelfthPercentage",
    "tenthPercentage",
    "parentsOccupation",
    "disability",
    "minorityStatus",
    "hosteller",
    "sportsQuota",
    "governmentEmployee",
    "educationLevel",
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  if (req.file) {
    user.photo = `/uploads/${req.file.filename}`;
  }

  const updatedUser = await user.save();
  res.json({ success: true, user: updatedUser });
});

module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};
