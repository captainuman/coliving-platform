const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { register, login, sendOtp } = require("../controllers/authController");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.post("/register", upload.single("govtId"), register);
router.post("/login", login);
router.post("/send-otp", sendOtp);

// Removed verifyOtp because register already verifies OTP

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const user = encodeURIComponent(
      JSON.stringify({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profilePic: req.user.profilePic,
      }),
    );

    return res.redirect(
      `${CLIENT_URL}/google-success?token=${token}&user=${user}`,
    );
  },
);

module.exports = router;
