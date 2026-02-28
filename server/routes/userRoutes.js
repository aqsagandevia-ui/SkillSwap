const router = require("express").Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile, getMentors, getAllUsers } = require("../controllers/userController");

router.get("/me", auth, getProfile);
router.get("/mentors", getMentors);  // Public endpoint to get all mentors
router.get("/all", auth, getAllUsers);  // Get all users for chat
router.put("/update", auth, updateProfile);

module.exports = router;
