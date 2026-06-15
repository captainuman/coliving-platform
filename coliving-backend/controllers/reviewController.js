const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Property = require("../models/Property");

exports.addReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating) {
      return res.status(400).json({
        message: "Property and rating are required",
      });
    }

    const bookings = await Booking.find({
      user: req.user.id,
      status: "approved",
    }).populate("room");

    const booking = bookings.find(
      (item) => item.room?.property?.toString() === propertyId,
    );

    if (!booking) {
      return res.status(403).json({
        message: "You have not stayed in this property",
      });
    }

    const existingReview = await Review.findOne({
      booking: booking._id,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this booking",
      });
    }

    const review = await Review.create({
      property: propertyId,
      tenant: req.user.id,
      rating,
      comment,
      booking: booking._id,
    });

    const reviews = await Review.find({
      property: propertyId,
    });

    const averageRating =
      reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;

    await Property.findByIdAndUpdate(propertyId, {
      rating: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      property: req.params.propertyId,
    })
      .populate("tenant", "name profilePic")
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    res.json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      tenant: req.user.id,
    })
      .populate("property", "title address rating reviewCount")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
