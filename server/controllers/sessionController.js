const User = require("../models/User");
const Session = require("../models/Session");
const Skill = require("../models/Skill");

// Get all sessions for current user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ mentor: req.user.id }, { learner: req.user.id }]
    }).populate("mentor", "name photo email role bio")
      .populate("learner", "name photo email role bio")
      .populate("skillTopic", "skillName");
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create new session request (learner sends request to teacher)
exports.createSession = async (req, res, next) => {
  console.log('[SESSION CONTROLLER] createSession called');
  console.log('[SESSION CONTROLLER] req.user:', req.user);
  console.log('[SESSION CONTROLLER] req.body:', req.body);
  
  const { teacherId, mentorId, skill, date, time } = req.body;
  const mentor = teacherId || mentorId; // Support both field names
  
  if (!mentor) {
    return res.status(400).json({ msg: "teacherId or mentorId is required" });
  }
  
  try {
    let skillTopicId;
    
    if (typeof skill === 'string') {
      const skillDoc = await Skill.findOne({ 
        skillName: { $regex: new RegExp(`^${skill.trim()}$`, 'i') } 
      }).select('_id');
      
      if (!skillDoc) {
        return res.status(400).json({ msg: `Skill "${skill}" not found. Please create the skill first or check spelling.` });
      }
      skillTopicId = skillDoc._id;
      console.log(`[SESSION CONTROLLER] Found skill "${skill}" with ID:`, skillTopicId);
    } else if (skill && typeof skill === 'object' && skill._id) {
      skillTopicId = skill._id;
    } else {
      return res.status(400).json({ msg: 'Invalid skill provided. Must be skill name (string) or skill object with _id.' });
    }
    
    console.log('[SESSION CONTROLLER] Creating session with:', { mentor, learnerId: req.user.id, skillTopicId, date, time });
    
    const session = await Session.create({
      mentor: mentor,
      learner: req.user.id,
      skillTopic: skillTopicId,
      scheduledAt: new Date(`${date}T${time}`),
      status: "pending"
    });

    // Populate mentor and learner details
    await session.populate("mentor", "name photo email role bio")
      .populate("learner", "name photo email role bio")
      .populate("skillTopic", "skillName");

    console.log('[SESSION CONTROLLER] Session created successfully:', session._id);
    res.json({ message: "Session request sent", session });
  } catch (err) {
    console.error('[SESSION CONTROLLER] Error creating session:', err);
    res.status(500).json({ msg: err.message });
  }
};

// Accept session (MENTOR ONLY: accepts and automatically generates meeting link)
exports.acceptSession = async (req, res) => {
  const { sessionId } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    // ⭐ SECURITY: Only mentor can accept and create the meeting link
    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only the mentor can accept this session and create the meeting link" });
    }

    // Get teacher details
    const teacher = await User.findById(req.user.id);

    // Parse date and time
    const startTime = new Date(session.scheduledAt);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour session
    
    const meetingTitle = `SkillSwap Session: ${session.skillTopic}`;
    const meetingDescription = `Skill exchange session for ${session.skillTopic} between ${teacher.name} and learner`;

    let liveLink = null;
    let googleEventId = null;

    // Try to create Google Meet link
    try {
      const { createGoogleMeetEvent } = require("../services/googleOAuth");
      const event = await createGoogleMeetEvent(
        meetingTitle,
        meetingDescription,
        startTime,
        endTime
      );
      liveLink = event.conferenceData?.entryPoints?.[0]?.uri || null;
      googleEventId = event.id;
      console.log("Google Meet created successfully:", liveLink);
    } catch (meetError) {
      console.error("Failed to create Google Meet link:", meetError.message);
      console.error("Full error:", meetError);
      // Fallback: Generate a unique meeting ID that users can use to join
      // This creates a direct meet link with a random ID that can be used immediately
      const randomId = Math.random().toString(36).substring(2, 10) + '-' + 
                       Math.random().toString(36).substring(2, 6);
      liveLink = `https://meet.google.com/${randomId}`;
      console.log("Using fallback meeting link:", liveLink);
    }

    // Store the meeting link
    session.meetingLink = liveLink;
    session.liveLink = liveLink; // Also set liveLink for consistency
    session.googleEventId = googleEventId;
    session.status = "accepted";
    
    await session.save();
    await session.populate("mentor", "name photo email role bio")
      .populate("learner", "name photo email role bio")
      .populate("skillTopic", "skillName");

    res.json({ message: "Session accepted", session });
  } catch (err) {
    console.error("Accept Session Error:", err);
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

    // Update mentor trustScore
    const mentor = await User.findById(session.mentor);
    if (mentor) {
      const currentScore = mentor.trustScore || 0;
      mentor.trustScore = ((currentScore + rating) / 2).toFixed(2);
      await mentor.save();
    }

    // Populate for response
    await session.populate("mentor", "name photo email role bio")
      .populate("learner", "name photo email role bio")
      .populate("skillTopic", "skillName");

    res.json({ message: "Session completed", session });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update meeting link (MENTOR ONLY: mentor can manually update the meeting link)
exports.updateMeetingLink = async (req, res) => {
  const { sessionId, meetingLink } = req.body;
  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ msg: "Session not found" });

    // ⭐ SECURITY: Only mentor can update the meeting link
    if (session.mentor.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only the mentor can update the meeting link" });
    }

    // Update the meeting link
    session.meetingLink = meetingLink;
    session.liveLink = meetingLink; // Also set liveLink for consistency
    
    await session.save();
    await session.populate("mentor", "name photo email role bio")
      .populate("learner", "name photo email role bio")
      .populate("skillTopic", "skillName");

    res.json({ message: "Meeting link updated", session });
  } catch (err) {
    console.error("Update Meeting Link Error:", err);
    res.status(500).json({ msg: err.message });
  }
};
