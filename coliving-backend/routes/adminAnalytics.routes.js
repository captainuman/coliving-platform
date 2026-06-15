const express = require("express");
const router = express.Router();

const {
  getAdminOverview,
  getUserAnalytics,
  getPropertyAnalytics,
  getRoomAnalytics,
  getBookingAnalytics,
  getReviewAnalytics,
  getConversationAnalytics,
  getFeedbackAnalytics,
  getUsersTable,
  getPropertiesTable,
  getRoomsTable,
  getBookingsTable,
  getReviewsTable,
  getFeedbackTable,
} = require("../controllers/adminAnalytics.controller");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.use(protect);
router.use(isAdmin);

router.get("/overview", getAdminOverview);
router.get("/users", getUserAnalytics);
router.get("/properties", getPropertyAnalytics);
router.get("/rooms", getRoomAnalytics);
router.get("/bookings", getBookingAnalytics);
router.get("/reviews", getReviewAnalytics);
router.get("/conversations", getConversationAnalytics);
router.get("/feedback", getFeedbackAnalytics);

router.get("/tables/users", getUsersTable);
router.get("/tables/properties", getPropertiesTable);
router.get("/tables/rooms", getRoomsTable);
router.get("/tables/bookings", getBookingsTable);
router.get("/tables/reviews", getReviewsTable);
router.get("/tables/feedback", getFeedbackTable);

module.exports = router;
