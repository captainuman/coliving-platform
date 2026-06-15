const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    type: {
      type: String,
      enum: ["shared", "private"],
      required: true,
    },

    rent: {
      type: Number,
      required: true,
      min: 0,
    },

    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    currentTenants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },

    genderPreference: {
      type: String,
      enum: ["male", "female", "any"],
      default: "any",
    },

    images: [String],

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

roomSchema.pre("save", function () {
  if (this.status !== "maintenance") {
    this.status =
      this.currentTenants.length >= this.capacity ? "occupied" : "available";
  }
});

module.exports = mongoose.model("Room", roomSchema);
