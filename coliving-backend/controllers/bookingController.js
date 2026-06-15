const Booking = require("../models/Booking");
const Room = require("../models/Room");

// CREATE BOOKING (Tenant)
exports.createBooking = async (req, res) => {
  try {
    const { room: roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        message: "Room is required"
      });
    }

    const room = await Room.findById(roomId).populate({
      path: "property",
      select: "owner"
    });

    if (!room) {
      return res.status(404).json({
        message: "Room not found"
      });
    }

    if (!room.isApproved || room.approvalStatus !== "approved") {
      return res.status(400).json({
        message: "Room is not approved yet"
      });
    }

    if (room.status === "maintenance") {
      return res.status(400).json({
        message: "Room is under maintenance"
      });
    }

    if (room.currentTenants.length >= room.capacity) {
      return res.status(400).json({
        message: "Room is already full"
      });
    }

    if (room.property.owner.toString() === req.user.id.toString()) {
      return res.status(403).json({
        message: "Owner cannot book their own property"
      });
    }

    const existingBooking = await Booking.findOne({
      room: roomId,
      user: req.user.id,
      status: { $in: ["pending", "approved"] }
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already have an active booking for this room"
      });
    }

    const booking = await Booking.create({
      room: roomId,
      user: req.user.id,
      status: "pending"
    });

    res.status(201).json({
      message: "Booking request sent",
      booking
    });
  } catch (err) {
    console.log("CREATE BOOKING ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

// UPDATE STATUS (Owner ONLY)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["approved", "rejected", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const booking = await Booking.findById(req.params.id).populate({
      path: "room",
      populate: {
        path: "property",
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!booking.room || !booking.room.property) {
      return res.status(400).json({
        message: "Room or property not linked",
      });
    }

    const propertyOwner = booking.room.property.owner.toString();

    if (req.user.id.toString() !== propertyOwner) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (booking.status === "expired") {
      return res.status(400).json({
        message: "Expired booking cannot be updated",
      });
    }

    const room = await Room.findById(booking.room._id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const oldStatus = booking.status;
    const newStatus = status;

    if (oldStatus === newStatus) {
      return res.json({
        message: `Booking already ${newStatus}`,
        booking,
      });
    }

    if (newStatus === "approved") {
      if (room.status === "maintenance") {
        return res.status(400).json({
          message: "Room is under maintenance",
        });
      }

      if (room.currentTenants.length >= room.capacity) {
        return res.status(400).json({
          message: "Room is already full",
        });
      }

      const alreadyTenant = room.currentTenants.some(
        (tenant) => tenant.toString() === booking.user.toString(),
      );

      if (!alreadyTenant) {
        room.currentTenants.push(booking.user);
      }
    }

    if (oldStatus === "approved" && newStatus !== "approved") {
      room.currentTenants = room.currentTenants.filter(
        (tenant) => tenant.toString() !== booking.user.toString(),
      );
    }

    booking.status = newStatus;

    await room.save();
    await booking.save();

    res.json({
      message: `Booking ${newStatus}`,
      booking,
    });
  } catch (err) {
    console.log("UPDATE BOOKING ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};

// GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      hiddenForUser: false,
    })
      .populate(
        "user",
        "name email gender food smoking sleep cleanliness profilePic",
      )
      .populate({
        path: "room",
        populate: {
          path: "property",
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

// GET OWNER BOOKINGS
exports.getOwnerBookings = async (req, res) => {
  try {
    const ownerRooms = await Room.find()
      .populate({
        path: "property",
        match: { owner: req.user.id },
        select: "owner title address",
      })
      .select("_id property");

    const roomIds = ownerRooms
      .filter((room) => room.property)
      .map((room) => room._id);

    const bookings = await Booking.find({
      room: { $in: roomIds },
      hiddenForOwner: false,
    })
      .populate({
        path: "room",
        populate: {
          path: "property",
        },
      })
      .populate(
        "user",
        "name email gender food smoking sleep cleanliness profilePic",
      )
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// DELETE USER BOOKING - hide only for user
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.hiddenForUser = true;
    await booking.save();

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// DELETE BOOKING BY OWNER
exports.deleteOwnerBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "room",
      populate: {
        path: "property",
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!booking.room || !booking.room.property) {
      return res.status(400).json({
        message: "Room or property not linked",
      });
    }

    if (booking.room.property.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    booking.hiddenForOwner = true;
    await booking.save();

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
