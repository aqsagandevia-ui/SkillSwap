const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { to, content } = req.body;
    const message = new Message({
      from: req.user.id,
      to,
      content
    });
    await message.save();
    res.json({ message: "Message sent", data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { from: req.user.id, to: userId },
        { from: userId, to: req.user.id }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
