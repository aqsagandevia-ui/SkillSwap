const Message = require("../models/Message");
const User = require("../models/User");

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    
    // Create unique chatId for the conversation
    const chatId = [req.user.id, receiverId].sort().join("_");
    
    const message = new Message({
      chatId,
      sender: req.user.id,
      receiver: receiverId,
      text,
      isRead: false
    });
    
    await message.save();
    
    // Populate sender info for the response
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name photo")
      .populate("receiver", "name photo");
    
    res.json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages with a specific user
exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const chatId = [req.user.id, userId].sort().join("_");
    
    const messages = await Message.find({ chatId })
      .populate("sender", "name photo")
      .populate("receiver", "name photo")
      .sort({ createdAt: 1 });
    
    // Mark messages as read
    await Message.updateMany(
      { chatId, receiver: req.user.id, isRead: false },
      { isRead: true }
    );
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all conversations (list of users the current user has chatted with)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all unique users the current user has messaged with
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate("sender", "name photo isOnline")
      .populate("receiver", "name photo isOnline")
      .sort({ createdAt: -1 });
    
    // Get unique users and their last message
    const conversationsMap = new Map();
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === userId 
        ? msg.receiver 
        : msg.sender;
      
      if (!conversationsMap.has(otherUser._id.toString())) {
        conversationsMap.set(otherUser._id.toString(), {
          user: otherUser,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unreadCount: msg.receiver._id.toString() === userId && !msg.isRead ? 1 : 0
        });
      } else {
        const conv = conversationsMap.get(otherUser._id.toString());
        if (msg.receiver._id.toString() === userId && !msg.isRead) {
          conv.unreadCount += 1;
        }
      }
    });
    
    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
