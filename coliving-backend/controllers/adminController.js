const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

// GET DASHBOARD DATA
exports.getDashboardData = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiresAt")
      .sort({ createdAt: -1 });

    const properties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "room",
        populate: {
          path: "property",
          select: "title address",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      users,
      properties,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// GET USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiresAt")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// GET PROPERTIES
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// DELETE PROPERTY
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    await Room.deleteMany({
      property: req.params.id,
    });

    res.json({
      message: "Property and related rooms deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// GET BOOKINGS
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate({
        path: "room",
        populate: {
          path: "property",
          select: "title address",
        },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// APPROVE ROOM
exports.approveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    room.isApproved = true;
    room.approvalStatus = "approved";

    await room.save();

    res.json({
      message: "Room approved successfully",
      room,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// REJECT ROOM
exports.rejectRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    room.isApproved = false;
    room.approvalStatus = "rejected";

    await room.save();

    res.json({
      message: "Room rejected",
      room,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
