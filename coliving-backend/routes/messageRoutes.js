const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

router.use(protect);

// GET MESSAGES
router.get("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(403).json({
        message: "Not authorized to view this conversation"
      });
    }

    const messages = await Message.find({
      conversation: req.params.conversationId
    })
      .populate("sender", "name email profilePic")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// SEND MESSAGE
router.post("/", async (req, res) => {
  try {
    const { conversationId, text, image } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        message: "Conversation is required"
      });
    }

    if (!text?.trim() && !image) {
      return res.status(400).json({
        message: "Message cannot be empty"
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(403).json({
        message: "Not authorized to send message"
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text?.trim() || "",
      image: image || ""
    });

    conversation.lastMessage = text?.trim() || "Image";
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name email profilePic"
    );

    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// MARK AS SEEN
router.put("/:conversationId/seen", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user._id },
        seen: false
      },
      {
        seen: true
      }
    );

    res.json({
      message: "Messages marked as seen"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;