const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createSession, completeSession, getSessions } = require("../controllers/sessionController");

router.post("/", auth, createSession);          // create new session
router.put("/complete", auth, completeSession); // update feedback & complete
router.get("/", auth, getSessions);             // get all sessions for user

module.exports = router;
