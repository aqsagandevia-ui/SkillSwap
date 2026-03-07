const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addSkill, getMySkills, getAllSkills, deleteSkill, updateSkill } = require("../controllers/skillController");

// Add a new skill
router.post("/", auth, addSkill);

// Get current user's skills
router.get("/my-skills", auth, getMySkills);

// Get all skills (for browsing)
router.get("/all", auth, getAllSkills);

// Delete a skill
router.delete("/:id", auth, deleteSkill);

// Update a skill
router.put("/:id", auth, updateSkill);

module.exports = router;

