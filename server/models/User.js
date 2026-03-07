const mongoose = require("mongoose");

/* =========================
   Availability Schema
========================= */
const availabilitySchema = new mongoose.Schema(
  {
    day: { type: String },
    time: { type: String },
  },
  { _id: false }
);

/* =========================
   User Schema
========================= */
const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    bio: { type: String },
    title: { type: String },
    photo: { type: String },

    // 🔐 Normal Login
    password: { type: String }, // hashed password
    
    // 🔑 Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // 🔐 Password Reset OTP
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },

    // 🔑 Google Login
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // Role
    role: { type: String, default: "user" },

    // Availability for sessions
    availability: [availabilitySchema],
    trustScore: { type: Number, default: 0 },

    // Skills the user can teach (has)
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill"
    }],

    // Skills the user wants to learn (stored as plain objects)
    skillsToLearn: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },

    // 💬 Realtime Chat
    isOnline: { type: Boolean, default: false },

    // 🔗 Google OAuth Tokens
    googleTokens: {
      access_token: { type: String },
      refresh_token: { type: String },
      scope: { type: String },
      token_type: { type: String },
      expiry_date: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
