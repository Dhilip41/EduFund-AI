const express = require("express");
const {
  getStudents,
  deleteStudent,
  getAllScholarshipApplications,
  updateScholarshipApplicationStatus,
  getAllLoanApplications,
  updateLoanApplicationStatus,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, admin);

router.get("/students", getStudents);
router.delete("/students/:id", deleteStudent);

router.get("/scholarship-applications", getAllScholarshipApplications);
router.put("/scholarship-applications/:id", updateScholarshipApplicationStatus);

router.get("/loan-applications", getAllLoanApplications);
router.put("/loan-applications/:id", updateLoanApplicationStatus);

router.get("/analytics", getAnalytics);

module.exports = router;
