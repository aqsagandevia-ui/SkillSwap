const router = require("express").Router();
const auth = require("../middleware/auth");
const { getMatches, createSession, getSessions, sendMessage, completeSession } = require("../controllers/matchController");

router.get("/matches", auth, getMatches);
router.post("/session", auth, createSession);
router.get("/sessions", auth, getSessions);
router.post("/message", auth, sendMessage);
router.post("/complete", auth, completeSession);

module.exports = router;
