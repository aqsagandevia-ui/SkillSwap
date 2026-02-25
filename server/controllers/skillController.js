const User = require("../models/User");

exports.addSkill = async (req, res) => {
  try {
    const { name, type } = req.body;
    const user = await User.findById(req.user.id);
    user.skills.push({ name, type });
    await user.save();
    res.json({ message: "Skill added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
