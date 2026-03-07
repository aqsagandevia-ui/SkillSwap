const mongoose = require("mongoose");

/* =========================
   Session Schema
========================= */
const sessionSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skill: {
    type: String,
    required: true,
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillRequest",
    required: false, // Made optional - can be linked later if needed
  },
  liveLink: {
    type: String,
    default: null,
  },
  googleEventId: {
    type: String,
    default: null,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  // Legacy fields for backward compatibility
  sessionDate: {
    type: String,
  },
  sessionTime: {
    type: String,
  },
  googleMeetLink: {
    type: String,
    default: null,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "rejected", "cancelled"],
    default: "pending",
  },
  rating: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
sessionSchema.pre("save", async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Session", sessionSchema);

