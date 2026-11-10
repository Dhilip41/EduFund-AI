const express = require("express");
const { recommendScholarships } = require("../controllers/scholarshipController");
const { recommendLoans } = require("../controllers/loanController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/predictScholarship", protect, recommendScholarships);
router.post("/predictLoan", protect, recommendLoans);

module.exports = router;
