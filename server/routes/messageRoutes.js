const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { sendMessage, getMessages, getConversations } = require("../controllers/messageController");

router.post("/", auth, sendMessage);              // send message
router.get("/:userId", auth, getMessages);        // get chat with a user
router.get("/conversations", auth, getConversations); // get all conversations

module.exports = router;
