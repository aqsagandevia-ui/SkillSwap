const { Server } = require("socket.io");
const Message = require("./models/Message");

const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // Join chat room
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log("📥 Joined chat:", chatId);
    });

    // Send message
    socket.on("sendMessage", async (data) => {
  if (!data.text) return;

  const message = await Message.create({
    chatId: data.chatId,
    sender: data.sender,
    text: data.text,
  });

  io.to(data.chatId).emit("receiveMessage", message);
}); 

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = socketServer;
