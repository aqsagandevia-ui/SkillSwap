const router = require("express").Router();
const auth = require("../middleware/auth");
const { 
  getMatches, 
  createSession, 
  getSessions, 
  sendMessage, 
  completeSession,
  createRequest,
  getIncomingRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  getAllRequests
} = require("../controllers/matchController");

// Matches
router.get("/matches", auth, getMatches);
router.get("/", auth, getAllRequests);

// Skill Exchange Requests
router.post("/request", auth, createRequest);
router.get("/requests/incoming", auth, getIncomingRequests);
router.get("/requests/sent", auth, getSentRequests);
router.put("/requests/:id/accept", auth, acceptRequest);
router.put("/requests/:id/reject", auth, rejectRequest);

// Sessions
router.post("/session", auth, createSession);
router.get("/sessions", auth, getSessions);
router.put("/sessions/:sessionId/complete", auth, completeSession);

// Messages
router.post("/message", auth, sendMessage);

module.exports = router;
