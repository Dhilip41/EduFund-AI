const asyncHandler = require("express-async-handler");
const Bank = require("../models/Bank");
const LoanApplication = require("../models/LoanApplication");
const { predictLoan } = require("../utils/aiService");

// @desc   Get all active banks
// @route  GET /api/loans/banks
// @access Public
const getBanks = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = { isActive: true };
  if (search) filter.bankName = { $regex: search, $options: "i" };

  const banks = await Bank.find(filter).sort({ interestRate: 1 });
  res.json({ success: true, count: banks.length, banks });
});

// @desc   Create bank
// @route  POST /api/loans/banks
// @access Private/Admin
const createBank = asyncHandler(async (req, res) => {
  const bank = await Bank.create(req.body);
  res.status(201).json({ success: true, bank });
});

// @desc   Update bank
// @route  PUT /api/loans/banks/:id
// @access Private/Admin
const updateBank = asyncHandler(async (req, res) => {
  const bank = await Bank.findById(req.params.id);
  if (!bank) {
    res.status(404);
    throw new Error("Bank not found");
  }
  Object.assign(bank, req.body);
  const updated = await bank.save();
  res.json({ success: true, bank: updated });
});

// @desc   Delete bank
// @route  DELETE /api/loans/banks/:id
// @access Private/Admin
const deleteBank = asyncHandler(async (req, res) => {
  const bank = await Bank.findById(req.params.id);
  if (!bank) {
    res.status(404);
    throw new Error("Bank not found");
  }
  await bank.deleteOne();
  res.json({ success: true, message: "Bank deleted" });
});

// @desc   AI recommendation: predict best loan options for the student's inputs
// @route  POST /api/prediction/predictLoan
// @access Private
const recommendLoans = asyncHandler(async (req, res) => {
  const input = req.body;
  const banks = await Bank.find({ isActive: true, maxAmount: { $gte: input.loanAmountRequired } });

  const results = await Promise.all(
    banks.map(async (bank) => {
      const prediction = await predictLoan({
        ...input,
        bankInterestRate: bank.interestRate,
        collegeType: input.collegeType,
      });
      return {
        bank,
        approvalProbability: prediction.approvalProbability,
        interestRate: prediction.interestRate ?? bank.interestRate,
        emi: prediction.emi,
        loanScore: prediction.loanScore,
      };
    })
  );

  const sorted = results.sort((a, b) => b.loanScore - a.loanScore).slice(0, 10);

  res.json({ success: true, recommendations: sorted });
});

// @desc   Apply for a loan with a specific bank
// @route  POST /api/loans/apply
// @access Private
const applyLoan = asyncHandler(async (req, res) => {
  const { bankId, ...loanInput } = req.body;

  const bank = await Bank.findById(bankId);
  if (!bank) {
    res.status(404);
    throw new Error("Bank not found");
  }

  const prediction = await predictLoan({ ...loanInput, bankInterestRate: bank.interestRate });

  const application = await LoanApplication.create({
    student: req.user._id,
    bank: bank._id,
    ...loanInput,
    approvalProbability: prediction.approvalProbability,
    interestRate: prediction.interestRate ?? bank.interestRate,
    emi: prediction.emi,
    loanScore: prediction.loanScore,
  });

  res.status(201).json({ success: true, application });
});

// @desc   Get logged-in student's loan applications
// @route  GET /api/loans/applications/me
// @access Private
const getMyLoanApplications = asyncHandler(async (req, res) => {
  const applications = await LoanApplication.find({ student: req.user._id })
    .populate("bank")
    .sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

module.exports = {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
  recommendLoans,
  applyLoan,
  getMyLoanApplications,
};
