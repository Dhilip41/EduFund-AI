const mongoose = require("mongoose");

const scholarshipApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    scholarship: { type: mongoose.Schema.Types.ObjectId, ref: "Scholarship", required: true },
    eligibilityScore: { type: Number, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScholarshipApplication", scholarshipApplicationSchema);
