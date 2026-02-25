// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const admin = require("../config/firebaseAdmin");

// // ------------------ REGISTER ------------------
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body;

//   // Name validation: only letters and spaces
//   if (!/^[A-Za-z ]+$/.test(name)) {
//     return res.status(400).json({ msg: "Name can only contain letters" });
//   }

//   try {
//     // Hash password
//     const hashed = await bcrypt.hash(password, 10);

//     // Create user
//     await User.create({ name, email, password: hashed });

//     res.json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(400).json({ msg: err.message });
//   }
// };

// // ------------------ LOGIN ------------------
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     // Compare password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ msg: "Wrong password" });

//     // Generate JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// };

// // ------------------ GOOGLE LOGIN ------------------
// exports.googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body;

//     // 1️⃣ Verify Firebase token
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const { name, email, picture } = decodedToken;

//     // 2️⃣ Check user in MongoDB
//     let user = await User.findOne({ email });

//     // 3️⃣ Create user if not exists
//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         photo: picture,
//         provider: "google",
//       });
//     }

//     // 4️⃣ Generate JWT
//     const jwtToken = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // 5️⃣ Send response
//     res.status(200).json({
//       success: true,
//       token: jwtToken,
//       user,
//     });
//   } catch (error) {
//     console.error("Google Login Error:", error);
//     res.status(401).json({ message: "Google login failed" });
//   }
// };

// // ------------------ GET CURRENT USER ------------------
// exports.getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // 5️⃣ Send response
//     res.status(200).json({
//       success: true,
//       token: jwtToken,
//       user,
//     });
//   } catch (error) {
//     console.error("Google Login Error:", error);
//     res.status(401).json({ message: "Google login failed" });
//   }
// };
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin");

// ------------------ REGISTER ------------------
// exports.register = async (req, res) => {
//   try {
//     const { fullName,name, email, password } = req.body;

//     const name = fullName;

//     // Validate name
//     if (!name || !/^[A-Za-z ]+$/.test(name)) {
//       return res.status(400).json({ msg: "Name can only contain letters" });
//     }

//     // Check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user,
//     });

//   } catch (err) {
//     console.error("Register Error:", err);
//     res.status(500).json({ msg: "Server error" });
//   }
// };
// ------------------ REGISTER ------------------
exports.register = async (req, res) => {
  try {
    const { fullName, name, email, password } = req.body;

    // accept both fullName and name
    const userName = fullName || name;

    if (!userName || !/^[A-Za-z ]+$/.test(userName)) {
      return res.status(400).json({ msg: "Name can only contain letters" });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    await User.create({
      name: userName,
      email,
      password: hashed,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ------------------ LOGIN ------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ------------------ GOOGLE LOGIN ------------------
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { name, email, picture } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        photo: picture,
        provider: "google",
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token: jwtToken,
      user,
    });

  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(401).json({ message: "Google login failed" });
  }
};

// ------------------ GET CURRENT USER ------------------
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};