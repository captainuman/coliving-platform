require("dotenv").config();
require("./cron/bookingExpiry");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const passport = require("passport");
const { Server } = require("socket.io");

require("./config/passport");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

/* ALLOWED ORIGINS */
const allowedOrigins = [
  "http://localhost:5173",
  "https://the-starks.vercel.app",
  "https://coliving-platform-outjqmn7s-kingnuman2611-gmailcoms-projects.vercel.app"
];

/* MIDDLEWARE */
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(express.json());
app.use(passport.initialize());

/* DATABASE */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* SOCKET.IO */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.userId = userId;

    onlineUsers.set(userId, socket.id);

    io.emit("onlineUsers", [...onlineUsers.keys()]);
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);

      io.emit("onlineUsers", [...onlineUsers.keys()]);
    }

    console.log("User disconnected");
  });
});

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API Running...");
});

/* STATIC FILES */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ROUTES */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/owner", require("./routes/ownerRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/owner/dashboard", require("./routes/ownerDashboardRoutes"));
app.use("/api/admin/analytics", require("./routes/adminAnalytics.routes"));

/* ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message || "Server error"
  });
});

/* SERVER */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});