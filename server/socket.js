const { Server } = require("socket.io");
const Message = require("./models/Message");

// Store online users
const onlineUsers = new Map();

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Handle user coming online
    socket.on("user_online", (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        
        // Broadcast user status to all clients
        io.emit("user_status_change", { userId, isOnline: true });
        console.log(`User ${userId} is online`);
      }
    });

    // Handle user going offline
    socket.on("user_offline", (userId) => {
      if (userId) {
        onlineUsers.delete(userId);
        
        // Broadcast user status to all clients
        io.emit("user_status_change", { userId, isOnline: false });
        console.log(`User ${userId} is offline`);
      }
    });

    // Join a specific chat room (for private messaging)
    socket.on("join_chat", ({ senderId, receiverId }) => {
      const roomId = [senderId, receiverId].sort().join("_");
      socket.join(roomId);
      console.log(`User ${senderId} joined chat room: ${roomId}`);
    });

    // Send private message
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, message, chatId } = data;
        
        if (!message || !senderId || !receiverId) {
          console.log("Missing required fields");
          return;
        }

        // Create message in database
        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          text: message,
          chatId: chatId || [senderId, receiverId].sort().join("_")
        });

        // Populate sender info
        await newMessage.populate("sender", "name photo");

        // Get the room ID
        const roomId = [senderId, receiverId].sort().join("_");
        
        // Emit to the specific chat room
        io.to(roomId).emit("receive_message", {
          _id: newMessage._id,
          sender: newMessage.sender,
          text: newMessage.text,
          createdAt: newMessage.createdAt
        });

        console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    // Handle typing indicator
    socket.on("typing", ({ senderId, receiverId }) => {
      const roomId = [senderId, receiverId].sort().join("_");
      socket.to(roomId).emit("user_typing", { senderId, isTyping: true });
    });

    // Handle stop typing
    socket.on("stop_typing", ({ senderId, receiverId }) => {
      const roomId = [senderId, receiverId].sort().join("_");
      socket.to(roomId).emit("user_typing", { senderId, isTyping: false });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit("user_status_change", { userId: socket.userId, isOnline: false });
        console.log(`🔴 User ${socket.userId} disconnected`);
      }
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  // Make io accessible for use in controllers
  io.getIO = () => io;

  return io;
};

module.exports = socketServer;
