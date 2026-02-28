const User = require("../models/User");

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all mentors (users with skills to teach)
exports.getMentors = async (req, res) => {
  try {
    // Get users who have at least one skill with type "teach"
    const mentors = await User.find({
      "skills.type": "teach"
    }).select("-password");
    
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update profile (skills + availability + basic info)
exports.updateProfile = async (req, res) => {
  try {
    const { name, title, bio, skills, availability } = req.body;

    // Build update object
    const updateData = {};
    
    // Handle basic info updates
    if (name !== undefined) updateData.name = name;
    if (title !== undefined) updateData.title = title;
    if (bio !== undefined) updateData.bio = bio;

    // Handle skills update
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({ msg: "Skills must be an array" });
      }
      for (let skill of skills) {
        if (!skill.name || !skill.type || !skill.level) {
          return res.status(400).json({ msg: "Each skill must have name, type, and level" });
        }
      }
      updateData.skills = skills;
    }

    // Handle availability update
    if (availability !== undefined) {
      if (!Array.isArray(availability)) {
        return res.status(400).json({ msg: "Availability must be an array" });
      }
      updateData.availability = availability;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all users (for chat - exclude current user)
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("name photo isOnline skills")
      .sort({ name: 1 });
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
