const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // BASIC
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    occupation: {
      type: String,
      trim: true,
      default: "",
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    dob: Date,

    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },

    // ROLE
    role: {
      type: String,
      enum: ["tenant", "owner", "admin"],
      default: "tenant",
    },

    // LIFESTYLE
    smoking: {
      type: String,
      enum: ["yes", "no", "occasionally", ""],
      default: "",
    },

    sleep: {
      type: String,
      enum: ["early", "late", "flexible", ""],
      default: "",
    },

    cleanliness: {
      type: String,
      enum: ["low", "medium", "high", ""],
      default: "",
    },

    food: {
      type: String,
      enum: ["veg", "non-veg", "both", ""],
      default: "",
    },

    // LOCATION
    country: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    zipCode: {
      type: String,
      trim: true,
      default: "",
    },

    // PREFERENCES
    currency: {
      type: String,
      trim: true,
      default: "",
    },

    profilePic: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      trim: true,
      default: "",
    },

    // VERIFICATION
    govtId: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiresAt: {
      type: Date,
      select: false,
    },

    lastSeen: Date,

    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
