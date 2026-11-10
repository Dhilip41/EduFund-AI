const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ScholarshipApplication = require("../models/ScholarshipApplication");
const LoanApplication = require("../models/LoanApplication");
const Scholarship = require("../models/Scholarship");
const Bank = require("../models/Bank");
const Notification = require("../models/Notification");

// @desc   Get all students
// @route  GET /api/admin/students
// @access Private/Admin
const getStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password");
  res.json({ success: true, count: students.length, students });
});

// @desc   Delete a student
// @route  DELETE /api/admin/students/:id
// @access Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }
  await student.deleteOne();
  res.json({ success: true, message: "Student removed" });
});

// @desc   Get all scholarship applications
// @route  GET /api/admin/scholarship-applications
// @access Private/Admin
const getAllScholarshipApplications = asyncHandler(async (req, res) => {
  const applications = await ScholarshipApplication.find()
    .populate("student", "name email")
    .populate("scholarship", "name amount")
    .sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

// @desc   Update scholarship application status (approve/reject)
// @route  PUT /api/admin/scholarship-applications/:id
// @access Private/Admin
const updateScholarshipApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // "Approved" | "Rejected"
  const application = await ScholarshipApplication.findById(req.params.id).populate("scholarship");
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  application.status = status;
  await application.save();

  await Notification.create({
    user: application.student,
    title: `Scholarship Application ${status}`,
    message: `Your application for "${application.scholarship.name}" has been ${status.toLowerCase()}.`,
    type: status === "Approved" ? "Approved" : "Rejected",
  });

  res.json({ success: true, application });
});

// @desc   Get all loan applications
// @route  GET /api/admin/loan-applications
// @access Private/Admin
const getAllLoanApplications = asyncHandler(async (req, res) => {
  const applications = await LoanApplication.find()
    .populate("student", "name email")
    .populate("bank", "bankName interestRate")
    .sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

// @desc   Update loan application status (approve/reject)
// @route  PUT /api/admin/loan-applications/:id
// @access Private/Admin
const updateLoanApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await LoanApplication.findById(req.params.id).populate("bank");
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  application.status = status;
  await application.save();

  await Notification.create({
    user: application.student,
    title: `Loan Application ${status}`,
    message: `Your loan application with "${application.bank.bankName}" has been ${status.toLowerCase()}.`,
    type: status === "Approved" ? "Approved" : "Rejected",
  });

  res.json({ success: true, application });
});

// @desc   Admin analytics summary
// @route  GET /api/admin/analytics
// @access Private/Admin
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalStudents, totalScholarships, totalBanks, totalScholarshipApps, totalLoanApps] =
    await Promise.all([
      User.countDocuments({ role: "student" }),
      Scholarship.countDocuments(),
      Bank.countDocuments(),
      ScholarshipApplication.countDocuments(),
      LoanApplication.countDocuments(),
    ]);

  const [scholarshipApproved, scholarshipRejected, loanApproved, loanRejected] = await Promise.all([
    ScholarshipApplication.countDocuments({ status: "Approved" }),
    ScholarshipApplication.countDocuments({ status: "Rejected" }),
    LoanApplication.countDocuments({ status: "Approved" }),
    LoanApplication.countDocuments({ status: "Rejected" }),
  ]);

  // Monthly stats for the last 6 months (scholarship + loan applications combined)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);

  const monthlyScholarship = await ScholarshipApplication.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const monthlyLoan = await LoanApplication.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json({
    success: true,
    analytics: {
      totalStudents,
      totalScholarships,
      totalBanks,
      totalScholarshipApps,
      totalLoanApps,
      scholarshipApproved,
      scholarshipRejected,
      loanApproved,
      loanRejected,
      approvalRate:
        totalScholarshipApps + totalLoanApps > 0
          ? Number(
              (
                ((scholarshipApproved + loanApproved) / (totalScholarshipApps + totalLoanApps)) *
                100
              ).toFixed(1)
            )
          : 0,
      monthlyScholarship,
      monthlyLoan,
    },
  });
});

module.exports = {
  getStudents,
  deleteStudent,
  getAllScholarshipApplications,
  updateScholarshipApplicationStatus,
  getAllLoanApplications,
  updateLoanApplicationStatus,
  getAnalytics,
};
