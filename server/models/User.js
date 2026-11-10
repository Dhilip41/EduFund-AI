const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"], minlength: 6 },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    photo: { type: String, default: "" },

    // OTP verification
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },

    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // Student profile fields
    phone: { type: String, default: "" },
    familyIncome: { type: Number, default: 0 },
    category: { type: String, enum: ["General", "OBC", "SC", "ST", "EWS", ""], default: "" },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    college: { type: String, default: "" },
    department: { type: String, default: "" },
    cgpa: { type: Number, default: 0 },
    twelfthPercentage: { type: Number, default: 0 },
    tenthPercentage: { type: Number, default: 0 },
    parentsOccupation: { type: String, default: "" },
    disability: { type: Boolean, default: false },
    minorityStatus: { type: Boolean, default: false },
    hosteller: { type: Boolean, default: false },
    sportsQuota: { type: Boolean, default: false },
    governmentEmployee: { type: Boolean, default: false },
    educationLevel: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
