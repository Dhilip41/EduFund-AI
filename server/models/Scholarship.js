const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    organization: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "EWS", "All"],
      default: "All",
    },
    minIncome: { type: Number, default: 0 },
    maxIncome: { type: Number, default: 999999999 },
    minCgpa: { type: Number, default: 0 },
    minTwelfthPercentage: { type: Number, default: 0 },
    genderEligible: { type: String, enum: ["Male", "Female", "Other", "All"], default: "All" },
    stateEligible: { type: String, default: "All" },
    disabilityOnly: { type: Boolean, default: false },
    minorityOnly: { type: Boolean, default: false },
    eligibility: { type: String, required: true },
    documentsRequired: [{ type: String }],
    deadline: { type: Date, required: true },
    description: { type: String, required: true },
    applyLink: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);
