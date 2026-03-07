const mongoose = require("mongoose");

/* =========================
   SkillRequest Schema
========================= */
const skillRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillOffer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
skillRequestSchema.index({ senderId: 1 });
skillRequestSchema.index({ receiverId: 1 });
skillRequestSchema.index({ status: 1 });
skillRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model("SkillRequest", skillRequestSchema);

