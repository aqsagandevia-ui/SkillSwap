const User = require("../models/User");
const Session = require("../models/Session");

// Get all sessions for current user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacher: req.user.id }, { learner: req.user.id }]
    }).populate("teacher learner", "name photo email");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create new session request (learner sends request to teacher)
exports.createSession = async (req, res) => {
  const { teacherId, skill, date, time } = req.body;
  try {
    const session = await Session.create({
      teacher: teacherId,
      learner: req.user.id,
      skill,
      date,
      time,
      status: "pending",
      liveLink: null
    });

    // Populate teacher and learner details
    await session.populate("teacher learner", "name photo email");

    res.json({ message: "Session request sent", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Accept session (teacher accepts and generates meeting link)
exports.acceptSession = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    // Verify the current user is the teacher
    if (session.teacher.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only the teacher can accept this session" });
    }

    // Generate live session link using Jitsi
    session.liveLink = `https://meet.jit.si/skillswap-${session._id}`;
    session.status = "accepted";
    
    await session.save();
    await session.populate("teacher learner", "name photo email");

    res.json({ message: "Session accepted", session });
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
    if (teacher) {
      const currentScore = teacher.trustScore || 0;
      teacher.trustScore = ((currentScore + rating) / 2).toFixed(2);
      await teacher.save();
    }

    res.json({ message: "Session completed", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
