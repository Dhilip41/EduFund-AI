const express = require("express");
const { getProfile, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("photo"), updateProfile);

module.exports = router;
