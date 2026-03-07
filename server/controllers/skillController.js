const Skill = require("../models/Skill");

// Add a new skill
exports.addSkill = async (req, res) => {
  try {
    const { skillName, category, description, experienceLevel } = req.body;
    
    console.log("📝 Adding skill - Body:", req.body);
    console.log("📝 User from auth:", req.user);
    
    if (!skillName || !skillName.trim()) {
      return res.status(400).json({ error: "Skill name is required" });
    }
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized - no user ID" });
    }
    
    const newSkill = new Skill({
      user: req.user.id,
      skillName: skillName.trim(),
      category: category || "other",
      description: description || "",
      experienceLevel: experienceLevel || "intermediate"
    });
    
    await newSkill.save();
    console.log("✅ Skill saved:", newSkill._id);
    res.json({ message: "Skill added successfully", skill: newSkill });
  } catch (err) {
    console.error("❌ Error adding skill:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get current user's skills
exports.getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all skills (for browsing)
exports.getAllSkills = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== "all") {
      query.category = category;
    }
    
    if (search) {
      query.skillName = { $regex: search, $options: "i" };
    }
    
    const skills = await Skill.find(query).populate("user", "name photo title bio").sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const { skillName, category, description, experienceLevel } = req.body;
    
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    
    if (skillName) skill.skillName = skillName;
    if (category) skill.category = category;
    if (description !== undefined) skill.description = description;
    if (experienceLevel) skill.experienceLevel = experienceLevel;
    
    await skill.save();
    res.json({ message: "Skill updated successfully", skill });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
