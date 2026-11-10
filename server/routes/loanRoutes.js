const express = require("express");
const {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
  applyLoan,
  getMyLoanApplications,
} = require("../controllers/loanController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/banks", getBanks);
router.post("/banks", protect, admin, createBank);
router.put("/banks/:id", protect, admin, updateBank);
router.delete("/banks/:id", protect, admin, deleteBank);

router.post("/apply", protect, applyLoan);
router.get("/applications/me", protect, getMyLoanApplications);

module.exports = router;
