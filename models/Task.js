// Tasks Schema
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: { type: String, trim: true, maxlength: 1000, default: "" },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    completed: { type: Boolean, required: true, default: false },
    estimatedHours: { type: Number, required: true, min: 0.5, max: 1000 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completionRate: { type: Number, default: 0 },
    priorityScore: { type: Number, default: 1 },
    daysSinceCreation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for performance
taskSchema.index({ userId: 1, createdAt: -1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, title: "text", description: "text" });

module.exports = mongoose.model("Task", taskSchema);