require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");


const User = require("./models/User");
const Message = require("./models/Message");

// =====================
// Routes
// =====================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const matchRoutes = require("./routes/matchRoutes");
const aiMatchRoutes = require("./routes/aiMatchRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const skillRoutes = require("./routes/skillRoutes");

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
// Increase payload limit for profile photo uploads (10MB)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security headers for COOP policy (fixes popup issues)
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// =====================
// API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/ai", aiMatchRoutes);
app.use("/api/session", sessionRoutes);

app.use("/api/skills", skillRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("SkillSwap API & Socket Running 🚀");
});

// Debug Route - test if server is accessible
app.get("/api/debug/test", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Server is running",
    timestamp: new Date(),
    mongoConnected: isDbConnected()
  });
});

// =====================
// MongoDB Connection Helper
// =====================
const isDbConnected = () => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return state === 1;
};

// =====================
// MongoDB Connection
// =====================
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
      console.log("❌ MongoDB Connection Error:", err.message);
    });
};

// Connect to MongoDB
connectDB();

// Track online users: Map<userId, socketId>
const onlineUsers = new Map();

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
  console.log("🟢 Client connected:", socket.id);

  // Handle user coming online
  socket.on("user_online", async (userId) => {
    if (!userId) return;
    
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    
    // Check if database is connected before attempting update
    if (!isDbConnected()) {
      console.warn("⚠️ MongoDB not connected - skipping user online status update");
      // Still broadcast status to clients for UI purposes
      io.emit("user_status_change", { userId, isOnline: true });
      return;
    }
    
    // Update database only if connected
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
    } catch (err) {
      console.error("Error updating user online status:", err.message);
    }
    
    // Broadcast to all clients
    io.emit("user_status_change", { userId, isOnline: true });
  });

  // Handle user going offline
  socket.on("user_offline", async (userId) => {
    if (!userId) return;
    
    onlineUsers.delete(userId);
    
    // Check if database is connected before attempting update
    if (!isDbConnected()) {
      console.warn("⚠️ MongoDB not connected - skipping user offline status update");
      io.emit("user_status_change", { userId, isOnline: false });
      return;
    }
    
    try {
      await User.findByIdAndUpdate(userId, { isOnline: false });
    } catch (err) {
      console.error("Error updating user offline status:", err.message);
    }
    
    io.emit("user_status_change", { userId, isOnline: false });
  });

  // Join a specific chat room for private messaging
  socket.on("join_chat", ({ senderId, receiverId }) => {
    console.log("🔗 JOIN_CHAT event received");
    console.log("  📤 Sender ID:", senderId);
    console.log("  📥 Receiver ID:", receiverId);
    
    if (!senderId || !receiverId) {
      console.log("❌ Missing sender or receiver ID");
      return;
    }
    
    const roomId = [senderId, receiverId].sort().join("_");
    console.log("  🏠 Joining room:", roomId);
    
    socket.join(roomId);
    console.log("  ✅ Socket joined room:", roomId);
    console.log("  📍 Socket ID:", socket.id);
    console.log("  👥 Room members:", io.sockets.adapter.rooms.get(roomId)?.size || 0);
  });

  // Send private message
  socket.on("send_message", async (data) => {
    // Check if database is connected
    if (!isDbConnected()) {
      console.warn("⚠️ MongoDB not connected - cannot send message");
      socket.emit("message_error", { error: "Database not connected" });
      return;
    }
    
    try {
      const { senderId, receiverId, message, chatId } = data;
      
      console.log("📨 Message event received:", { senderId, receiverId, messagePreview: message?.substring(0, 50) });
      
      if (!message || !senderId || !receiverId) {
        console.log("❌ Missing required fields:", { message: !!message, senderId, receiverId });
        socket.emit("message_error", { error: "Missing required fields" });
        return;
      }

      if (senderId === receiverId) {
        console.log("❌ Cannot send message to yourself");
        socket.emit("message_error", { error: "Cannot send message to yourself" });
        return;
      }

      // Get sender and receiver user objects for full info
      const senderUser = await User.findById(senderId).select("name photo");
      const receiverUser = await User.findById(receiverId).select("name photo");

      if (!senderUser || !receiverUser) {
        console.log("❌ Sender or receiver not found in database");
        socket.emit("message_error", { error: "User not found" });
        return;
      }

      // Create message in database
      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text: message,
        chatId: chatId || [senderId, receiverId].sort().join("_"),
        isRead: false
      });

      // Get the room ID
      const roomId = [senderId, receiverId].sort().join("_");
      
      console.log(`✅ Message saved to DB (ID: ${newMessage._id})`);
      console.log(`📢 Broadcasting to room: ${roomId}`);

      // Prepare message data with full user info
      const messageData = {
        _id: newMessage._id,
        sender: {
          _id: senderUser._id,
          name: senderUser.name,
          photo: senderUser.photo
        },
        receiver: {
          _id: receiverUser._id,
          name: receiverUser.name,
          photo: receiverUser.photo
        },
        text: newMessage.text,
        createdAt: newMessage.createdAt,
        isRead: newMessage.isRead
      };
      
      // Emit to the chat room (both users will receive if they're in the room)
      io.to(roomId).emit("receive_message", messageData);
      console.log(`✅ Message emitted to room: ${roomId}`);
      
      // Also notify the receiver about the new message (for unread count update)
      io.to(`user_${receiverId}`).emit("message_received", {
        from: senderId,
        message: messageData
      });
      console.log(`✅ Unread notification sent to user: ${receiverId}`);

      // Send confirmation back to sender
      socket.emit("message_sent", { _id: newMessage._id, success: true });
      console.log(`✅ Confirmation sent to sender`);
      
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      socket.emit("message_error", { error: err.message });
    }
  });

  // Handle typing indicator
  socket.on("typing", ({ senderId, receiverId }) => {
    if (!senderId || !receiverId) return;
    const roomId = [senderId, receiverId].sort().join("_");
    socket.to(roomId).emit("user_typing", { senderId, isTyping: true });
  });

  // Handle stop typing
  socket.on("stop_typing", ({ senderId, receiverId }) => {
    if (!senderId || !receiverId) return;
    const roomId = [senderId, receiverId].sort().join("_");
    socket.to(roomId).emit("user_typing", { senderId, isTyping: false });
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    console.log("🔴 Client disconnected:", socket.id);
    
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      
      // Check if database is connected before attempting update
      if (!isDbConnected()) {
        console.warn("⚠️ MongoDB not connected - skipping user offline status update on disconnect");
        io.emit("user_status_change", { userId: socket.userId, isOnline: false });
        console.log(`🔴 User ${socket.userId} disconnected (DB unavailable)`);
        return;
      }
      
      try {
        await User.findByIdAndUpdate(socket.userId, { isOnline: false });
      } catch (err) {
        console.error("Error updating user offline status:", err.message);
      }
      
      io.emit("user_status_change", { userId: socket.userId, isOnline: false });
      console.log(`🔴 User ${socket.userId} disconnected`);
    }
  });
});

// =====================
// MongoDB Connection Event Listeners
// =====================
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB error:", err.message);
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});

// =====================
// Server Start
// =====================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server & Socket running on port ${PORT}`);
});

