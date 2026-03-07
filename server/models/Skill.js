const mongoose = require("mongoose");

/* =========================
   Skill Schema
========================= */
const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["technology", "design", "business", "language", "music", "art", "sports", "other"],
    default: "other",
  },
  description: {
    type: String,
    trim: true,
  },
  experienceLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced", "expert"],
    default: "intermediate",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
skillSchema.index({ user: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ skillName: "text" });

// Update timestamp on save
skillSchema.pre("save", async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Skill", skillSchema);

