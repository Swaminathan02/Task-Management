const User = require("../models/User");

// Auth Routes
class AuthController {
  static async signup(req, res) {
    try {
      const { username, email, password } = req.body;

      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      if (username.length < 3) {
        return res
          .status(400)
          .json({ message: "Username must be at least 3 characters" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        const field = existingUser.email === email ? "email" : "username";
        return res
          .status(400)
          .json({ message: `User with this ${field} already exists` });
      }

      // Create new user (Note: In production, you should hash passwords)
      const user = new User({ username, email, password });
      await user.save();

      // Return user without password
      const userResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };
      res.status(201).json({
        message: "User created successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("Signup error:", error);
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res
          .status(400)
          .json({ message: `User with this ${field} already exists` });
      }
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: messages.join(", ") });
      }
      res.status(500).json({ message: "Server error during signup" });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      // Find user by username or email
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Return user without password
      const userResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };
      res.json({
        message: "Login successful",
        user: userResponse,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
}

module.exports = AuthController;
