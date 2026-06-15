const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    hiddenForUser: {
      type: Boolean,
      default: false,
    },

    hiddenForOwner: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },

    moveInDate: {
      type: Date,
      default: null
    },
    
    moveOutDate: {
      type: Date,
      required: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "expired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ expiresAt: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
