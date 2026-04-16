const mongoose = require("mongoose");

/* =========================
   Session Schema
========================= */
const sessionSchema = new mongoose.Schema({
  // Participants
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  // Skill being taught
  skillTopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: false,
  },
  
  // Session scheduling
  scheduledAt: {
    type: Date,
  },
  
  duration: {
    type: Number, // in minutes
    default: 60
  },
  
  // Session details
  status: {
    type: String,
    enum: ["scheduled", "pending", "accepted", "ongoing", "completed", "cancelled", "no-show"],
    default: "scheduled",
  },
  
  // Meeting link
  meetingLink: {
    type: String,
    default: null,
  },
  
  // Google Event ID (for calendar integration)
  googleEventId: {
    type: String,
    default: null,
  },
  
  // Live link (alias for meetingLink)
  liveLink: {
    type: String,
    default: null,
  },
  
  // Completion
  completedAt: {
    type: Date,
  },
  
  // Feedback (stored separately, but can be linked to reviews)
  mentorFeedback: {
    type: String,
  },
  learnerFeedback: {
    type: String,
  },
  
  // Messages during session
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    text: String,
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Link to skill request if applicable
  skillRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillRequest",
  },
  
  // Timestamps
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

// Index for efficient queries
sessionSchema.index({ mentor: 1 });
sessionSchema.index({ learner: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ scheduledAt: 1 });

module.exports = mongoose.model("Session", sessionSchema);

