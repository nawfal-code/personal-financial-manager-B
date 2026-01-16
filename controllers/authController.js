// controllers/authController.js
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ====================
// Register User
// ====================
export const registerUser = async (req, res) => {
  try {
    const { name = "", email = "", password = "" } = req.body;

    // Validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
  
     await newUser.save();

    res.status(201).json({
      message: "Registration successful"
    });
  } 
  catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message});
  }
};

// ====================
// Login User
// ====================
export const loginUser = async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { _id: user._id},
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } 
  catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message});
  }
};

// ====================
// Get Profile (Protected)
// ====================
export const getProfile = async (req, res) => {
  try {
    // req.user should be set by auth middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
