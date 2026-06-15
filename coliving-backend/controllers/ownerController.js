const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Property = require("../models/Property");

exports.getOwnerTenants = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id,
    }).select("_id");

    const propertyIds = properties.map((property) => property._id);

    const rooms = await Room.find({
      property: { $in: propertyIds },
    }).select("_id");

    const roomIds = rooms.map((room) => room._id);

    const bookings = await Booking.find({
      room: { $in: roomIds },
      status: "approved",
    })
      .populate("user", "name email mobile gender occupation profilePic")
      .populate({
        path: "room",
        populate: {
          path: "property",
          select: "title address owner",
        },
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("GET OWNER TENANTS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch tenants",
    });
  }
};

exports.removeTenant = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate({
      path: "room",
      populate: {
        path: "property",
        select: "owner",
      },
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!booking.user) {
      return res.status(400).json({
        message: "Booking has no user linked",
      });
    }

    if (!booking.room || !booking.room.property) {
      return res.status(400).json({
        message: "Room or property not linked",
      });
    }

    if (booking.room.property.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await Room.findByIdAndUpdate(booking.room._id, {
      $pull: {
        currentTenants: booking.user,
      },
    });

    await Booking.findByIdAndUpdate(booking._id, {
      status: "expired",
    });

    res.json({
      message: "Tenant removed successfully",
    });
  } catch (err) {
    console.error("REMOVE TENANT ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
