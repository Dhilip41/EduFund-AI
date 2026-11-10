const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true },
    loanType: {
      type: String,
      enum: ["Domestic", "International", "Both"],
      default: "Both",
    },
    interestRate: { type: Number, required: true },
    processingFee: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    minCreditScore: { type: Number, default: 650 },
    eligibility: { type: String, required: true },
    documentsRequired: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
