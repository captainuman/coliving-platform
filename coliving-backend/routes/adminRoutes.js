const express = require("express");
const router = express.Router();

const {
  getUsers,
  deleteUser,
  getProperties,
  deleteProperty,
  getBookings,
} = require("../controllers/adminController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.use(protect);
router.use(isAdmin);

router.get("/users", getUsers);

router.delete("/users/:id", deleteUser);

router.get("/properties", getProperties);

router.delete("/properties/:id", deleteProperty);

router.get("/bookings", getBookings);

module.exports = router;
