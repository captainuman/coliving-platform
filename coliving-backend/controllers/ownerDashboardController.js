const Property = require("../models/Property");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

exports.getOwnerDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const properties = await Property.find({ owner: ownerId });
    const propertyIds = properties.map((p) => p._id);

    const rooms = await Room.find({
      property: { $in: propertyIds },
    })
      .populate("property", "title")
      .populate(
        "currentTenants",
        "name email mobile gender occupation isVerified",
      );

    const roomIds = rooms.map((r) => r._id);

    const bookings = await Booking.find({
      room: { $in: roomIds },
      hiddenForOwner: false,
    })
      .populate("user", "name email mobile gender")
      .populate("room", "type rent property")
      .sort({ createdAt: -1 });

    const reviews = await Review.find({
      property: { $in: propertyIds },
    })
      .populate("tenant", "name email")
      .sort({ createdAt: -1 });

    const totalCapacity = rooms.reduce(
      (sum, room) => sum + (room.capacity || 0),
      0,
    );

    const currentTenants = rooms.reduce(
      (sum, room) => sum + (room.currentTenants?.length || 0),
      0,
    );

    const occupiedRooms = rooms.filter(
      (room) => (room.currentTenants?.length || 0) > 0,
    ).length;

    const fullRooms = rooms.filter(
      (room) =>
        room.capacity > 0 &&
        (room.currentTenants?.length || 0) >= room.capacity,
    ).length;

    const availableRooms = rooms.filter(
      (room) =>
        room.status !== "maintenance" &&
        (room.currentTenants?.length || 0) < (room.capacity || 0),
    ).length;

    const maintenanceRooms = rooms.filter(
      (room) => room.status === "maintenance",
    ).length;

    const occupancyRate =
      totalCapacity > 0
        ? Number(((currentTenants / totalCapacity) * 100).toFixed(2))
        : 0;

    const expectedMonthlyRevenue = rooms.reduce((sum, room) => {
      return sum + (room.rent || 0) * (room.currentTenants?.length || 0);
    }, 0);

    const potentialMonthlyRevenue = rooms.reduce((sum, room) => {
      return sum + (room.rent || 0) * (room.capacity || 0);
    }, 0);

    const revenueLoss = potentialMonthlyRevenue - expectedMonthlyRevenue;

    const avgRating =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            ).toFixed(1),
          )
        : 0;

    const propertyAnalytics = properties.map((property) => ({
      id: property._id,
      title: property.title,
      rating: property.rating,
      reviews: property.reviewCount,
      approved: property.isApproved,
    }));

    const roomAnalytics = rooms.map((room) => ({
      roomId: room._id,
      property: room.property?.title || "N/A",
      type: room.type,
      rent: room.rent,
      deposit: room.deposit,
      capacity: room.capacity,
      occupied: room.currentTenants?.length || 0,
      occupancy:
        room.capacity > 0
          ? Number(
              (
                ((room.currentTenants?.length || 0) / room.capacity) *
                100
              ).toFixed(2),
            )
          : 0,
      status:
        room.status === "maintenance"
          ? "maintenance"
          : (room.currentTenants?.length || 0) >= (room.capacity || 0)
            ? "occupied"
            : (room.currentTenants?.length || 0) > 0
              ? "partially occupied"
              : "available",
    }));

    const bookingChart = [
      {
        name: "Pending",
        value: bookings.filter((b) => b.status === "pending").length,
      },
      {
        name: "Approved",
        value: bookings.filter((b) => b.status === "approved").length,
      },
      {
        name: "Rejected",
        value: bookings.filter((b) => b.status === "rejected").length,
      },
      {
        name: "Cancelled",
        value: bookings.filter((b) => b.status === "cancelled").length,
      },
      {
        name: "Expired",
        value: bookings.filter((b) => b.status === "expired").length,
      },
    ];

    const revenueByProperty = properties.map((property) => {
      const propertyRooms = rooms.filter(
        (room) => room.property?._id?.toString() === property._id.toString(),
      );

      const revenue = propertyRooms.reduce((sum, room) => {
        return sum + (room.rent || 0) * (room.currentTenants?.length || 0);
      }, 0);

      return {
        property: property.title,
        revenue,
      };
    });

    const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: reviews.filter((review) => review.rating === rating).length,
    }));

    const tenantAnalytics = [];

    rooms.forEach((room) => {
      room.currentTenants?.forEach((tenant) => {
        const tenantBooking = bookings.find(
          (booking) =>
            booking.user?._id?.toString() === tenant._id.toString() &&
            booking.room?._id?.toString() === room._id.toString() &&
            booking.status === "approved",
        );

        tenantAnalytics.push({
          tenantId: tenant._id,
          name: tenant.name,
          email: tenant.email,
          mobile: tenant.mobile,
          gender: tenant.gender,
          occupation: tenant.occupation,
          isVerified: tenant.isVerified,
          property: room.property?.title || "N/A",
          roomId: room._id,
          roomType: room.type,
          rent: room.rent,
          joinedDate: tenantBooking?.createdAt || room.createdAt,
          leaveDate: tenantBooking?.moveOutDate || null,
        });
      });
    });

    res.status(200).json({
      success: true,

      kpis: {
        totalProperties: properties.length,
        totalRooms: rooms.length,
        totalCapacity,

        availableRooms,
        occupiedRooms,
        fullRooms,
        maintenanceRooms,

        currentTenants,
        occupancyRate,

        expectedMonthlyRevenue,
        potentialMonthlyRevenue,
        revenueLoss,

        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        approvedBookings: bookings.filter((b) => b.status === "approved")
          .length,
        rejectedBookings: bookings.filter((b) => b.status === "rejected")
          .length,
        cancelledBookings: bookings.filter((b) => b.status === "cancelled")
          .length,
        expiredBookings: bookings.filter((b) => b.status === "expired").length,

        averageRating: avgRating,
        totalReviews: reviews.length,
      },

      charts: {
        bookingChart,
        revenueByProperty,
        ratingDistribution,
      },

      analytics: {
        propertyAnalytics,
        roomAnalytics,
        tenantAnalytics,
      },

      recentBookings: bookings.slice(0, 10),
      recentReviews: reviews.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch owner dashboard stats",
      error: error.message,
    });
  }
};
