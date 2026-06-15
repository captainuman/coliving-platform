const express = require("express");
const router = express.Router();

const {
  getOwnerDashboardStats
} = require("../controllers/ownerDashboardController");

const {
  protect,
  isOwner
} = require("../middleware/authMiddleware");

router.get(
  "/stats",
  protect,
  isOwner,
  getOwnerDashboardStats
);

module.exports = router;