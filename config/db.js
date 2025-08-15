const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error(" Database connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
