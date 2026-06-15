const User = require("../models/User");
const Property = require("../models/Property");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Conversation = require("../models/Conversation");
const Feedback = require("../models/Feedback");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

exports.getAdminOverview = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalTenants,
    totalOwners,
    totalAdmins,
    totalProperties,
    approvedProperties,
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    totalBookings,
    pendingBookings,
    approvedBookings,
    rejectedBookings,
    cancelledBookings,
    expiredBookings,
    totalReviews,
    totalFeedbackMessages,
    activeOnlineUsers,
    avgReviewRating,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "tenant" }),
    User.countDocuments({ role: "owner" }),
    User.countDocuments({ role: "admin" }),

    Property.countDocuments(),
    Property.countDocuments({ isApproved: true }),

    Room.countDocuments(),
    Room.countDocuments({ status: "available" }),
    Room.countDocuments({ status: "occupied" }),
    Room.countDocuments({ status: "maintenance" }),

    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "approved" }),
    Booking.countDocuments({ status: "rejected" }),
    Booking.countDocuments({ status: "cancelled" }),
    Booking.countDocuments({ status: "expired" }),

    Review.countDocuments(),
    Feedback.countDocuments(),
    User.countDocuments({ isOnline: true }),

    Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]),
  ]);

  res.json({
    totalUsers,
    totalTenants,
    totalOwners,
    totalAdmins,

    totalProperties,
    approvedProperties,
    pendingProperties: totalProperties - approvedProperties,

    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,

    totalBookings,
    pendingBookings,
    approvedBookings,
    rejectedBookings,
    cancelledBookings,
    expiredBookings,

    averagePropertyRating: Number(
      (avgReviewRating[0]?.averageRating || 0).toFixed(1),
    ),

    totalReviews,
    totalFeedbackMessages,
    activeOnlineUsers,

    bookingConversionRate:
      totalBookings > 0
        ? Number(((approvedBookings / totalBookings) * 100).toFixed(2))
        : 0,
  });
});

exports.getUserAnalytics = asyncHandler(async (req, res) => {
  const [
    usersByRole,
    registrationsByDay,
    registrationsByMonth,
    verifiedUsers,
    onlineUsers,
    usersByCity,
    usersByGender,
    usersByOccupation,
    usersBySmoking,
    usersBySleep,
    usersByCleanliness,
    usersByFood,
  ] = await Promise.all([
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),

    User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    User.aggregate([{ $group: { _id: "$isVerified", count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: "$isOnline", count: { $sum: 1 } } }]),

    User.aggregate([
      { $match: { city: { $nin: [null, ""] } } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    User.aggregate([
      { $match: { gender: { $nin: [null, ""] } } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]),

    User.aggregate([
      { $match: { occupation: { $nin: [null, ""] } } },
      { $group: { _id: "$occupation", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    User.aggregate([
      { $match: { smoking: { $nin: [null, ""] } } },
      { $group: { _id: "$smoking", count: { $sum: 1 } } },
    ]),

    User.aggregate([
      { $match: { sleep: { $nin: [null, ""] } } },
      { $group: { _id: "$sleep", count: { $sum: 1 } } },
    ]),

    User.aggregate([
      { $match: { cleanliness: { $nin: [null, ""] } } },
      { $group: { _id: "$cleanliness", count: { $sum: 1 } } },
    ]),

    User.aggregate([
      { $match: { food: { $nin: [null, ""] } } },
      { $group: { _id: "$food", count: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    usersByRole,
    registrationsByDay,
    registrationsByMonth,
    verifiedUsers,
    onlineUsers,
    usersByCity,
    usersByGender,
    usersByOccupation,
    preferences: {
      smoking: usersBySmoking,
      sleep: usersBySleep,
      cleanliness: usersByCleanliness,
      food: usersByFood,
    },
  });
});

exports.getPropertyAnalytics = asyncHandler(async (req, res) => {
  const [
    approvalStatus,
    propertiesByState,
    propertiesByDistrict,
    propertiesByArea,
    genderPreference,
    amenitiesPopularity,
    topRatedProperties,
    lowRatedProperties,
    avgRating,
  ] = await Promise.all([
    Property.aggregate([
      { $group: { _id: "$isApproved", count: { $sum: 1 } } },
    ]),

    Property.aggregate([
      { $group: { _id: "$address.state", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Property.aggregate([
      { $group: { _id: "$address.district", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Property.aggregate([
      { $group: { _id: "$address.area", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Property.aggregate([
      { $group: { _id: "$genderPreference", count: { $sum: 1 } } },
    ]),

    Property.aggregate([
      { $unwind: "$amenities" },
      { $group: { _id: "$amenities", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Property.find()
      .sort({ rating: -1, reviewCount: -1 })
      .limit(10)
      .select("title address rating reviewCount genderPreference isApproved"),

    Property.find({ rating: { $gt: 0, $lte: 2.5 } })
      .sort({ rating: 1 })
      .limit(10)
      .select("title address rating reviewCount"),

    Property.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: "$reviewCount" },
        },
      },
    ]),
  ]);

  res.json({
    approvalStatus,
    propertiesByState,
    propertiesByDistrict,
    propertiesByArea,
    genderPreference,
    amenitiesPopularity,
    topRatedProperties,
    lowRatedProperties,
    averageRating: avgRating[0]?.averageRating || 0,
    totalPropertyReviews: avgRating[0]?.totalReviews || 0,
  });
});

exports.getRoomAnalytics = asyncHandler(async (req, res) => {
  const [
    roomsByType,
    roomsByStatus,
    genderPreference,
    capacityUtilization,
    rentStats,
    rentByLocation,
  ] = await Promise.all([
    Room.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),

    Room.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

    Room.aggregate([
      { $group: { _id: "$genderPreference", count: { $sum: 1 } } },
    ]),

    Room.aggregate([
      {
        $project: {
          property: 1,
          type: 1,
          capacity: 1,
          currentTenantsCount: { $size: "$currentTenants" },
          utilization: {
            $cond: [
              { $gt: ["$capacity", 0] },
              {
                $multiply: [
                  { $divide: [{ $size: "$currentTenants" }, "$capacity"] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ]),

    Room.aggregate([
      {
        $group: {
          _id: null,
          averageRent: { $avg: "$rent" },
          averageDeposit: { $avg: "$deposit" },
          minRent: { $min: "$rent" },
          maxRent: { $max: "$rent" },
        },
      },
    ]),

    Room.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "property",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" },
      {
        $group: {
          _id: {
            state: "$property.address.state",
            district: "$property.address.district",
            area: "$property.address.area",
          },
          averageRent: { $avg: "$rent" },
          averageDeposit: { $avg: "$deposit" },
          roomCount: { $sum: 1 },
        },
      },
      { $sort: { averageRent: -1 } },
    ]),
  ]);

  res.json({
    roomsByType,
    roomsByStatus,
    genderPreference,
    capacityUtilization,
    rentStats: rentStats[0] || {},
    rentByLocation,
  });
});

exports.getBookingAnalytics = asyncHandler(async (req, res) => {
  const [
    bookingsByStatus,
    bookingTrendsByDay,
    bookingTrendsByMonth,
    expiringBookings,
    hiddenBookings,
  ] = await Promise.all([
    Booking.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

    Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    Booking.find({
      expiresAt: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
      .populate("user", "name email")
      .populate("room", "type rent status")
      .sort({ expiresAt: 1 })
      .limit(20),

    Booking.aggregate([
      {
        $group: {
          _id: null,
          hiddenForUser: {
            $sum: { $cond: [{ $eq: ["$hiddenForUser", true] }, 1, 0] },
          },
          hiddenForOwner: {
            $sum: { $cond: [{ $eq: ["$hiddenForOwner", true] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const totalBookings = await Booking.countDocuments();
  const approvedBookings = await Booking.countDocuments({ status: "approved" });

  res.json({
    bookingsByStatus,
    bookingTrendsByDay,
    bookingTrendsByMonth,
    expiringBookings,
    hiddenBookings: hiddenBookings[0] || {
      hiddenForUser: 0,
      hiddenForOwner: 0,
    },
    conversionRate:
      totalBookings > 0
        ? Number(((approvedBookings / totalBookings) * 100).toFixed(2))
        : 0,
  });
});

exports.getReviewAnalytics = asyncHandler(async (req, res) => {
  const [
    averageRating,
    ratingDistribution,
    mostReviewedProperties,
    recentReviews,
    lowRatedProperties,
  ] = await Promise.all([
    Review.aggregate([
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]),

    Review.aggregate([
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),

    Review.aggregate([
      {
        $group: {
          _id: "$property",
          reviewCount: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" },
      {
        $project: {
          reviewCount: 1,
          averageRating: 1,
          title: "$property.title",
          address: "$property.address",
        },
      },
    ]),

    Review.find()
      .populate("tenant", "name email")
      .populate("property", "title address")
      .sort({ createdAt: -1 })
      .limit(10),

    Review.aggregate([
      {
        $group: {
          _id: "$property",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
      { $match: { averageRating: { $lte: 2.5 } } },
      { $sort: { averageRating: 1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" },
      {
        $project: {
          averageRating: 1,
          reviewCount: 1,
          title: "$property.title",
          address: "$property.address",
        },
      },
    ]),
  ]);

  res.json({
    averageRating: averageRating[0]?.averageRating || 0,
    ratingDistribution,
    mostReviewedProperties,
    recentReviews,
    lowRatedProperties,
  });
});

exports.getConversationAnalytics = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalConversations,
    recentConversations,
    activeConversations,
    usersWithMostConversations,
  ] = await Promise.all([
    Conversation.countDocuments(),

    Conversation.find()
      .populate("participants", "name email role")
      .sort({ lastMessageAt: -1 })
      .limit(10),

    Conversation.countDocuments({
      lastMessageAt: { $gte: sevenDaysAgo },
    }),

    Conversation.aggregate([
      { $unwind: "$participants" },
      {
        $group: {
          _id: "$participants",
          conversationCount: { $sum: 1 },
        },
      },
      { $sort: { conversationCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          conversationCount: 1,
          name: "$user.name",
          email: "$user.email",
          role: "$user.role",
        },
      },
    ]),
  ]);

  res.json({
    totalConversations,
    recentConversations,
    activeConversations,
    usersWithMostConversations,
  });
});

exports.getFeedbackAnalytics = asyncHandler(async (req, res) => {
  const [totalFeedback, recentFeedback, feedbackByDate] = await Promise.all([
    Feedback.countDocuments(),

    Feedback.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(20),

    Feedback.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({
    totalFeedback,
    recentFeedback,
    feedbackByDate,
  });
});

exports.getUsersTable = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -otp -otpExpiresAt")
    .sort({ createdAt: -1 });

  res.json(users);
});

exports.getPropertiesTable = asyncHandler(async (req, res) => {
  const properties = await Property.find()
    .populate("owner", "name email role")
    .sort({ createdAt: -1 });

  res.json(properties);
});

exports.getRoomsTable = asyncHandler(async (req, res) => {
  const rooms = await Room.find()
    .populate("property", "title address")
    .populate("currentTenants", "name email")
    .sort({ createdAt: -1 });

  res.json(rooms);
});

exports.getBookingsTable = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email role")
    .populate({
      path: "room",
      select: "type rent deposit status property",
      populate: {
        path: "property",
        select: "title address",
      },
    })
    .sort({ createdAt: -1 });

  res.json(bookings);
});

exports.getReviewsTable = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("tenant", "name email")
    .populate("property", "title address")
    .populate("booking", "status")
    .sort({ createdAt: -1 });

  res.json(reviews);
});

exports.getFeedbackTable = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.json(feedback);
});
