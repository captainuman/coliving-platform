const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Property = require("../models/Property");
const calculateCompatibility = require("../utils/compatibility");

// CREATE ROOM
exports.createRoom = async (req, res) => {
  try {
    const property = await Property.findById(req.body.property);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const imagePaths =
      req.files?.map((file) => `/uploads/rooms/${file.filename}`) || [];

    const room = await Room.create({
      property: req.body.property,
      type: req.body.type,
      capacity: req.body.capacity,
      rent: req.body.rent,
      deposit: req.body.deposit,
      genderPreference: req.body.genderPreference,
      status: "available",
      images: imagePaths,
      isApproved: false,
      approvalStatus: "pending",
    });

    res.status(201).json(room);
  } catch (err) {
    console.error("CREATE ROOM ERROR:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

// GET ROOMS BY PROPERTY
exports.getRooms = async (req, res) => {
  try {
    const { maxRent, roomType, gender } = req.query;

    const filter = {
      property: req.params.propertyId,
      isApproved: true,
      approvalStatus: "approved",
    };

    if (gender) {
      filter.genderPreference = { $in: [gender, "any"] };
    }

    if (maxRent && !isNaN(maxRent)) {
      filter.rent = { $lte: Number(maxRent) };
    }

    if (roomType) {
      filter.type = roomType;
    }

    const rooms = await Room.find(filter).populate("property");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ROOM COMPATIBILITY
exports.getRoomCompatibility = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const bookings = await Booking.find({
      room: req.params.id,
      status: "approved",
    }).populate("user");

    if (bookings.length === 0) {
      return res.json({
        compatibility: 100,
        availableSpaces: room.capacity,
        currentTenants: [],
      });
    }

    let total = 0;
    const tenantMatches = bookings.map((booking) => {
      const score = calculateCompatibility(req.user, booking.user);
      total += score;

      return {
        _id: booking.user._id,
        name: booking.user.name,
        email: booking.user.email,
        score,
      };
    });

    res.json({
      compatibility: total / bookings.length,
      availableSpaces: Math.max(room.capacity - bookings.length, 0),
      currentTenants: tenantMatches,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH ROOMS
exports.searchRooms = async (req, res) => {
  try {
    const { location, gender, maxRent, roomType } = req.query;

    const propertyFilter = {};

    if (location) {
      propertyFilter.$or = [
        { "address.area": { $regex: location, $options: "i" } },
        { "address.district": { $regex: location, $options: "i" } },
        { "address.state": { $regex: location, $options: "i" } },
        { "address.pincode": { $regex: location, $options: "i" } },
      ];
    }

    const properties = await Property.find(propertyFilter).select("_id");
    const propertyIds = properties.map((p) => p._id);

    const roomFilter = {
      property: { $in: propertyIds },
      isApproved: true,
      approvalStatus: "approved",
    };

    if (maxRent && !isNaN(maxRent)) {
      roomFilter.rent = { $lte: Number(maxRent) };
    }

    if (roomType) {
      roomFilter.type = roomType;
    }

    if (gender) {
      roomFilter.genderPreference = { $in: [gender, "any"] };
    }

    const rooms = await Room.find(roomFilter).populate("property");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OWNER ROOMS
exports.getOwnerRooms = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user.id,
    }).select("_id");

    const propertyIds = properties.map((property) => property._id);

    const rooms = await Room.find({
      property: { $in: propertyIds },
    }).populate("property");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ROOM
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("property");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.property.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    room.type = req.body.type ?? room.type;
    room.rent = req.body.rent ?? room.rent;
    room.deposit = req.body.deposit ?? room.deposit;
    room.capacity = req.body.capacity ?? room.capacity;
    room.genderPreference = req.body.genderPreference ?? room.genderPreference;

    if (req.files?.length) {
      const newImages = req.files.map(
        (file) => `/uploads/rooms/${file.filename}`,
      );
      room.images = [...room.images, ...newImages];
    }

    room.approvalStatus = "pending";
    room.isApproved = false;

    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE ROOM
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("property");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.property.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (room.currentTenants.length > 0) {
      return res.status(400).json({
        message: "Cannot delete occupied room",
      });
    }

    await room.deleteOne();

    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: GET PENDING ROOMS
exports.getPendingRoomRequests = async (req, res) => {
  try {
    const rooms = await Room.find({
      approvalStatus: "pending",
      isApproved: false,
    }).populate({
      path: "property",
      select: "title address owner",
      populate: {
        path: "owner",
        select: "name email",
      },
    });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: APPROVE ROOM
exports.approveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.isApproved = true;
    room.approvalStatus = "approved";

    await room.save();

    res.json({
      message: "Room approved successfully",
      room,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: REJECT ROOM
exports.rejectRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.isApproved = false;
    room.approvalStatus = "rejected";

    await room.save();

    res.json({
      message: "Room rejected",
      room,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
