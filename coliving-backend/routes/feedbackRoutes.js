const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");
const sendEmail = require("../utils/sendEmail");
const { protect } = require("../middleware/authMiddleware");

// TEST EMAIL ROUTE (remove in production)
router.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      process.env.ADMIN_EMAIL,
      "HometownHub Test",
      "Email system is working",
    );

    res.json({
      message: "Email sent",
    });
  } catch (err) {
    console.log("TEST EMAIL ERROR:", err);

    res.status(500).json({
      message: "Email test failed",
    });
  }
});

// SEND FEEDBACK
router.post("/", protect, async (req, res) => {
  try {
    const message = req.body.message?.trim();

    if (!message) {
      return res.status(400).json({
        message: "Feedback message is required",
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        message: "Feedback is too long",
      });
    }

    const feedback = await Feedback.create({
      user: req.user.id,
      message,
    });

    await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Feedback Received - HometownHub",
      `
User: ${req.user.name || "Unknown"}
Email: ${req.user.email || "N/A"}
User ID: ${req.user.id}

Message:
${message}
      `,
    );

    res.status(201).json({
      message: "Feedback sent successfully",
      feedback,
    });
  } catch (err) {
    console.log("FEEDBACK ERROR:", err);

    res.status(500).json({
      message: "Failed to send feedback",
    });
  }
});

module.exports = router;
