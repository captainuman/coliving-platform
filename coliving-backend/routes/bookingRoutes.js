const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  deleteBooking,
  deleteOwnerBooking,
} = require("../controllers/bookingController");

const { protect, isOwner } = require("../middleware/authMiddleware");

router.get("/my", protect, getUserBookings);

router.get("/owner", protect, isOwner, getOwnerBookings);

router.post("/", protect, createBooking);

router.patch("/:id", protect, isOwner, updateBookingStatus);

router.delete("/:id", protect, deleteBooking);

router.delete("/owner/:id", protect, isOwner, deleteOwnerBooking);

module.exports = router;
