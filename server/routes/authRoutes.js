const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  verifyOtp,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validateRequest,
  registerUser
);

router.post("/verify-otp", verifyOtp);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  loginUser
);

router.post("/forgot-password", body("email").isEmail(), validateRequest, forgotPassword);
router.post(
  "/reset-password/:token",
  body("password").isLength({ min: 6 }),
  validateRequest,
  resetPassword
);

module.exports = router;
