const express = require("express");
const router = express.Router();

const {
  updatePreferences,
  getCompatibility,
  getMyProfile,
  updateProfile,
  getUserById,
  updateEmail,
  updatePassword,
  deleteAccount
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.patch("/preferences", protect, updatePreferences);

router.get("/me", protect, getMyProfile);
router.put("/me", protect, upload.single("profilePic"), updateProfile);
router.delete("/me", protect, deleteAccount);

router.put("/me/email", protect, updateEmail);
router.put("/me/password", protect, updatePassword);

router.get("/match/:id", protect, getCompatibility);
router.get("/:id", protect, getUserById);

module.exports = router;