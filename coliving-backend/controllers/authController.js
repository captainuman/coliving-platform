const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// TEMP OTP STORE
const otpStore = {};

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    await sendEmail(
      email,
      "Your OTP Code",
      `Your HomeTown Hub OTP is ${generatedOtp}. It expires in 10 minutes.`,
    );

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
  console.error("SEND OTP ERROR:", err);

  return res.status(500).json({
    message: "Email service timeout. Please try again later."
  });
}
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const {
      name,
      mobile,
      password,
      dob,
      role,
      gender,
      smoking,
      sleep,
      cleanliness,
      food,
      country,
      city,
      zipCode,
      currency,
      language,
      otp,
    } = req.body;

    const email = req.body.email?.toLowerCase().trim();

    if (!name || !email || !mobile || !password || !dob || !otp) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const storedOtp = otpStore[email];

    if (
      !storedOtp ||
      storedOtp.otp !== otp ||
      storedOtp.expiresAt < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const govtId = req.file ? req.file.path : "";

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashed,
      dob,
      role: role || "tenant",
      gender,
      smoking,
      sleep,
      cleanliness,
      food,
      country,
      city,
      zipCode,
      currency,
      language,
      govtId,
      isVerified: true,
    });

    delete otpStore[email];

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Registration successful",
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
