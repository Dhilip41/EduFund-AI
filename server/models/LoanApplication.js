const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true },
    collegeFee: { type: Number, required: true },
    tuitionFee: { type: Number, required: true },
    course: { type: String, required: true },
    collegeType: { type: String, enum: ["Government", "Private", "Deemed"], required: true },
    country: { type: String, required: true },
    loanAmountRequired: { type: Number, required: true },
    repaymentYears: { type: Number, required: true },
    income: { type: Number, required: true },
    existingLoan: { type: Number, default: 0 },
    creditScore: { type: Number, required: true },
    coApplicantIncome: { type: Number, default: 0 },
    approvalProbability: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    emi: { type: Number, required: true },
    loanScore: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);
