const express = require("express");
const {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  applyScholarship,
  getMyScholarshipApplications,
} = require("../controllers/scholarshipController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getScholarships);
router.get("/applications/me", protect, getMyScholarshipApplications);
router.get("/:id", getScholarshipById);
router.post("/", protect, admin, createScholarship);
router.put("/:id", protect, admin, updateScholarship);
router.delete("/:id", protect, admin, deleteScholarship);
router.post("/:id/apply", protect, applyScholarship);

module.exports = router;
