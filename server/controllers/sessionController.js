const User = require("../models/User");
const Session = require("../models/Session");

// Get all sessions for current user
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

// Create new session request
exports.createSession = async (req, res) => {
  const { teacherId, skill } = req.body;
  try {
    const session = await Session.create({
      teacher: teacherId,
      learner: req.user.id,
      skill,
      status: "pending"
    });

    // Generate live session link using Jitsi
    session.liveLink = `https://meet.jit.si/${session._id}`;
    await session.save();

    res.json({ message: "Session requested", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Send message in session
exports.sendMessage = async (req, res) => {
  const { sessionId, text } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    session.messages.push({
      sender: req.user.id,
      text,
      createdAt: new Date()
    });

    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Accept session (teacher accepts learner request)
exports.acceptSession = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    if (session.teacher.toString() !== req.user.id)
      return res.status(403).json({ msg: "Only teacher can accept session" });

    session.status = "accepted";
    await session.save();
    res.json({ message: "Session accepted", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Complete session + rating + feedback
exports.completeSession = async (req, res) => {
  const { sessionId, rating, feedback } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    session.status = "completed";
    session.rating = rating;
    session.feedback = feedback;

    await session.save();

    // Update teacher trustScore
    const teacher = await User.findById(session.teacher);
    teacher.trustScore = ((teacher.trustScore + rating) / 2).toFixed(2);
    await teacher.save();

    res.json({ message: "Session completed", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
