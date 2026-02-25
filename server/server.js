const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// =====================
// Routes
// =====================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const matchRoutes = require("./routes/matchRoutes");
const aiMatchRoutes = require("./routes/aiMatchRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

// =====================
// App & Server
// =====================
const app = express();
const server = http.createServer(app);

// =====================
// Middlewares
// =====================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

// =====================
// API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/ai", aiMatchRoutes);
app.use("/api/session", sessionRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SkillSwap API & Socket Running 🚀");
});

// =====================
// MongoDB Connection
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// =====================
// Socket.IO Setup
// =====================
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join chat room
  socket.on("join_room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(` User joined room: ${roomId}`);
  });

  // Send message
  socket.on("send_message", (data) => {
    /*
      data = {
        roomId,
        senderId,
        message
      }
    */

    if (!data?.roomId || !data?.message) {
      console.log(" Invalid message data:", data);
      return;
    }

    console.log(" Message received:", data);

    io.to(data.roomId).emit("receive_message", {
      senderId: data.senderId,
      message: data.message,
      createdAt: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// =====================
// Server Start
// =====================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server & Socket running on port ${PORT}`);
});
