const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRooms,
  getRoomCompatibility,
  searchRooms,
  getOwnerRooms,
  updateRoom,
  deleteRoom,
  rejectRoom,
  approveRoom,
  getPendingRoomRequests
} = require("../controllers/roomController");

const roomUpload = require("../middleware/roomUpload");

const {
  protect,
  isOwner,
  isAdmin
} = require("../middleware/authMiddleware");

// Owner creates room
router.post(
  "/",
  protect,
  isOwner,
  roomUpload.array("images", 5),
  createRoom
);

// Admin room requests
router.get(
  "/admin/pending",
  protect,
  isAdmin,
  getPendingRoomRequests
);

router.patch(
  "/admin/:id/approve",
  protect,
  isAdmin,
  approveRoom
);

router.patch(
  "/admin/:id/reject",
  protect,
  isAdmin,
  rejectRoom
);

// Search rooms
router.get("/search/all", searchRooms);

// Owner rooms
router.get("/owner/all", protect, isOwner, getOwnerRooms);

// Compatibility
router.get("/compatibility/:id", protect, getRoomCompatibility);

// Owner updates room
router.patch(
  "/:id",
  protect,
  isOwner,
  roomUpload.array("images", 5),
  updateRoom
);

// Owner deletes room
router.delete(
  "/:id",
  protect,
  isOwner,
  deleteRoom
);

// Rooms by property
router.get("/:propertyId", getRooms);

module.exports = router;