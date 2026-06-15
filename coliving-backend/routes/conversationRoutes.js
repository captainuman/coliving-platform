const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

router.use(protect);

// Get all conversations of logged-in user
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profilePic role")
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversation: conv._id,
          sender: { $ne: userId },
          seen: false,
        });

        return {
          ...conv.toObject(),
          unreadCount,
        };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Create conversation
router.post("/", async (req, res) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        message: "Receiver is required",
      });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "Cannot create conversation with yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const existingConversation = await Conversation.findOne({
      participants: {
        $all: [req.user._id, receiverId],
        $size: 2,
      },
    }).populate("participants", "name email profilePic role");

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = await Conversation.create({
      participants: [req.user._id, receiverId],
      lastMessage: "",
      lastMessageAt: new Date(),
    });

    const populatedConversation = await Conversation.findById(
      conversation._id,
    ).populate("participants", "name email profilePic role");

    res.status(201).json(populatedConversation);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
