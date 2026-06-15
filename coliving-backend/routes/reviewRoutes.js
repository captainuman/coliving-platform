const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// Create review
router.post(
  "/",
  protect,
  reviewController.addReview
);

// Logged-in user's reviews
router.get(
  "/my-reviews",
  protect,
  reviewController.getMyReviews
);

// Property reviews (public)
router.get(
  "/property/:propertyId",
  reviewController.getPropertyReviews
);

module.exports = router;