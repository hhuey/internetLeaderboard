const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// MongoDB connection
mongoose.connect("mongodb://localhost:27017/internetleaderboardDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

// Define a schema and model for storing website data
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true  },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
});
module.exports = mongoose.model("User", userSchema);

// Define a schema and model for storing website data
const visitedWebsitesSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  website: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  numberOfVisits: { type: Number, default: 1 },
});
module.exports = mongoose.model("VisitedWebsites", visitedWebsitesSchema);

const app = express();
app.use(express.json());
app.use(cors());

// Simple test route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});


// Authentication middleware
app.get("/api/user", authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const visitCount = await VisitedWebsites.countDocuments({ userID: req.userId });
    res.json({ username: user.username, uniqueVisits: visitCount });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

