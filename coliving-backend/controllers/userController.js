const User = require("../models/User");
const calculateCompatibility = require("../utils/compatibility");
const bcrypt = require("bcryptjs");

// GET MY PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "occupation",
      "mobile",
      "dob",
      "gender",
      "smoking",
      "sleep",
      "cleanliness",
      "food",
      "country",
      "city",
      "zipCode",
      "currency",
      "language",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.food === "nonveg") {
      updateData.food = "non-veg";
    }

    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.log("UPDATE PROFILE ERROR:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// UPDATE LIFESTYLE PREFERENCES
exports.updatePreferences = async (req, res) => {
  try {
    const allowedFields = ["gender", "smoking", "sleep", "cleanliness", "food"];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET COMPATIBILITY
exports.getCompatibility = async (req, res) => {
  try {
    const user1 = await User.findById(req.user.id);
    const user2 = await User.findById(req.params.id);

    if (!user1 || !user2) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const score = calculateCompatibility(user1, user2);

    res.json({ compatibility: score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -otp -otpExpiresAt",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE EMAIL
exports.updateEmail = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const existingUser = await User.findOne({ email });

    if (
      existingUser &&
      existingUser._id.toString() !== req.user.id.toString()
    ) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    user.email = email;
    await user.save();

    res.json({
      message: "Email updated successfully",
      email: user.email,
    });
  } catch (err) {
    console.log("UPDATE EMAIL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log("UPDATE PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.log("DELETE ACCOUNT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
