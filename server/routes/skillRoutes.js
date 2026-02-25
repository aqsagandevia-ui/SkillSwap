const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addSkill } = require("../controllers/skillController");

router.post("/", auth, addSkill);

module.exports = router;
