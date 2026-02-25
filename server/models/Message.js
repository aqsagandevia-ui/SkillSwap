const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true }, // user1_user2
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
