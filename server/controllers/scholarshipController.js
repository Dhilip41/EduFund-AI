const asyncHandler = require("express-async-handler");
const Scholarship = require("../models/Scholarship");
const ScholarshipApplication = require("../models/ScholarshipApplication");
const User = require("../models/User");
const { predictScholarship } = require("../utils/aiService");

// @desc   Get all active scholarships (with optional search/filter)
// @route  GET /api/scholarships
// @access Public
const getScholarships = asyncHandler(async (req, res) => {
  const { search, category, state } = req.query;
  const filter = { isActive: true };

  if (search) filter.name = { $regex: search, $options: "i" };
  if (category && category !== "All") filter.category = category;
  if (state && state !== "All") filter.stateEligible = state;

  const scholarships = await Scholarship.find(filter).sort({ deadline: 1 });
  res.json({ success: true, count: scholarships.length, scholarships });
});

// @desc   Get single scholarship
// @route  GET /api/scholarships/:id
// @access Public
const getScholarshipById = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id);
  if (!scholarship) {
    res.status(404);
    throw new Error("Scholarship not found");
  }
  res.json({ success: true, scholarship });
});

// @desc   Create scholarship
// @route  POST /api/scholarships
// @access Private/Admin
const createScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.create(req.body);
  res.status(201).json({ success: true, scholarship });
});

// @desc   Update scholarship
// @route  PUT /api/scholarships/:id
// @access Private/Admin
const updateScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id);
  if (!scholarship) {
    res.status(404);
    throw new Error("Scholarship not found");
  }
  Object.assign(scholarship, req.body);
  const updated = await scholarship.save();
  res.json({ success: true, scholarship: updated });
});

// @desc   Delete scholarship
// @route  DELETE /api/scholarships/:id
// @access Private/Admin
const deleteScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id);
  if (!scholarship) {
    res.status(404);
    throw new Error("Scholarship not found");
  }
  await scholarship.deleteOne();
  res.json({ success: true, message: "Scholarship deleted" });
});

// @desc   AI recommendation: get top matching scholarships for logged-in student
// @route  POST /api/prediction/predictScholarship
// @access Private
const recommendScholarships = asyncHandler(async (req, res) => {
  // Allow overriding profile fields from the request body (the recommendation form)
  const student = { ...req.user.toObject(), ...req.body };

  const scholarships = await Scholarship.find({ isActive: true });

  const results = await Promise.all(
    scholarships.map(async (scholarship) => {
      const prediction = await predictScholarship(student, scholarship);
      return {
        scholarship,
        eligibilityScore: prediction.eligibilityScore,
        reason: prediction.reason,
      };
    })
  );

  const sorted = results
    .filter((r) => r.eligibilityScore >= 40)
    .sort((a, b) => b.eligibilityScore - a.eligibilityScore)
    .slice(0, 10);

  res.json({ success: true, recommendations: sorted });
});

// @desc   Apply to a scholarship
// @route  POST /api/scholarships/:id/apply
// @access Private
const applyScholarship = asyncHandler(async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id);
  if (!scholarship) {
    res.status(404);
    throw new Error("Scholarship not found");
  }

  const existing = await ScholarshipApplication.findOne({
    student: req.user._id,
    scholarship: scholarship._id,
  });
  if (existing) {
    res.status(400);
    throw new Error("You have already applied for this scholarship");
  }

  const prediction = await predictScholarship(req.user.toObject(), scholarship);

  const application = await ScholarshipApplication.create({
    student: req.user._id,
    scholarship: scholarship._id,
    eligibilityScore: prediction.eligibilityScore,
    reason: prediction.reason,
  });

  res.status(201).json({ success: true, application });
});

// @desc   Get logged-in student's scholarship applications
// @route  GET /api/scholarships/applications/me
// @access Private
const getMyScholarshipApplications = asyncHandler(async (req, res) => {
  const applications = await ScholarshipApplication.find({ student: req.user._id })
    .populate("scholarship")
    .sort({ createdAt: -1 });
  res.json({ success: true, applications });
});

module.exports = {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  recommendScholarships,
  applyScholarship,
  getMyScholarshipApplications,
};
