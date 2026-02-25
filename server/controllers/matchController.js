const User = require("../models/User");
const Session = require("../models/Session");

// Get matches for current user (based on skills learner wants to learn)
exports.getMatches = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);

    // Get skills user wants to learn
    const learnSkills = me.skills.filter(s => s.type === "learn").map(s => s.name.toLowerCase());

    // Find users who can teach any of these skills
    const matches = await User.find({
      _id: { $ne: me._id },
      "skills.type": "teach",
      "skills.name": { $in: learnSkills }
    }).select("name skills trustScore");

    res.json(matches);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Request session with teacher for a skill
exports.createSession = async (req, res) => {
  const { teacherId, skill } = req.body;
  try {
    const session = await Session.create({
      teacher: teacherId,
      learner: req.user.id,
      skill,
      status: "pending"
    });
    res.json({ message: "Session requested", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get sessions for current user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacher: req.user.id }, { learner: req.user.id }]
    }).populate("teacher learner", "name skills");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Send message in session
exports.sendMessage = async (req, res) => {
  const { sessionId, text } = req.body;
  try {
    const session = await Session.findById(sessionId);
    session.messages.push({ sender: req.user.id, text });
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Complete session + rating
exports.completeSession = async (req, res) => {
  const { sessionId, rating, feedback } = req.body;
  try {
    const session = await Session.findById(sessionId);
    session.status = "completed";
    session.rating = rating;
    session.feedback = feedback;
    await session.save();

    // update teacher trustScore
    const teacher = await User.findById(session.teacher);
    teacher.trustScore = ((teacher.trustScore + rating) / 2).toFixed(2);
    await teacher.save();

    res.json({ message: "Session completed", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
