const express = require("express");
const router = express.Router();
const { register, login, googleLogin, getMe } = require("../controllers/authController");
const auth = require("../middleware/auth");

// User registration and login
router.post("/register", register);
router.post("/login", login);

// Google login
router.post("/google-login", googleLogin);

// Get current user (protected)
router.get("/me", auth, getMe);

module.exports = router;
