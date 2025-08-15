// controllers/TaskController.js
const Task = require("../models/Task.js");

class TaskController {
  static async getTasks(req, res) {
    try {
      const {
        page = 1,
        limit = 5,
        search = "",
        priority = "",
        status = "",
        sort = "createdAt",
      } = req.query;

      // Build filter query
      const filter = { userId: req.userId };

      // Add search filter
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Add priority filter
      if (priority) {
        filter.priority = priority;
      }

      // Add status filter
      if (status === "completed") {
        filter.completed = true;
      } else if (status === "pending") {
        filter.completed = false;
      }

      // Build sort object
      let sortObj = {};
      switch (sort) {
        case "title":
          sortObj = { title: 1 };
          break;
        case "priority":
          // Custom priority sorting: urgent > high > medium > low
          sortObj = {
            priority: 1,
            createdAt: -1,
          };
          break;
        case "estimatedHours":
          sortObj = { estimatedHours: -1 };
          break;
        default:
          sortObj = { createdAt: -1 };
      }

      // If sorting by priority, we need to use aggregation for proper priority ordering
      let tasks;
      let totalTasks;

      if (sort === "priority") {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

        const aggregationPipeline = [
          { $match: filter },
          {
            $addFields: {
              priorityOrder: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$priority", "urgent"] }, then: 4 },
                    { case: { $eq: ["$priority", "high"] }, then: 3 },
                    { case: { $eq: ["$priority", "medium"] }, then: 2 },
                    { case: { $eq: ["$priority", "low"] }, then: 1 },
                  ],
                  default: 1,
                },
              },
            },
          },
          { $sort: { priorityOrder: -1, createdAt: -1 } },
          { $skip: (parseInt(page) - 1) * parseInt(limit) },
          { $limit: parseInt(limit) },
          { $project: { priorityOrder: 0 } },
        ];

        tasks = await Task.aggregate(aggregationPipeline);
        totalTasks = await Task.countDocuments(filter);
      } else {
        tasks = await Task.find(filter)
          .sort(sortObj)
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit))
          .lean();

        totalTasks = await Task.countDocuments(filter);
      }

      const totalPages = Math.ceil(totalTasks / parseInt(limit));

      res.json({
        tasks,
        currentPage: parseInt(page),
        totalPages,
        totalTasks,
        hasMore: parseInt(page) < totalPages,
      });
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ message: "Server error while fetching tasks" });
    }
  }

  static async createTask(req, res) {
    try {
      const { title, description, priority, completed, estimatedHours } =
        req.body;
      if (!title || !priority || estimatedHours === undefined) {
        return res
          .status(400)
          .json({
            message: "Title, priority, and estimated hours are required",
          });
      }
      const task = new Task({
        title: title.trim(),
        description: description ? description.trim() : "",
        priority,
        completed: Boolean(completed),
        estimatedHours: parseFloat(estimatedHours),
        userId: req.userId,
      });
      await task.save();
      res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error while creating task" });
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, priority, completed, estimatedHours } =
        req.body;
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: req.userId },
        {
          title: title.trim(),
          description: description ? description.trim() : "",
          priority,
          completed: Boolean(completed),
          estimatedHours: parseFloat(estimatedHours),
        },
        { new: true, runValidators: true }
      );
      if (!task)
        return res
          .status(404)
          .json({ message: "Task not found or unauthorized" });
      res.json({ message: "Task updated successfully", task });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error while updating task" });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

      if (!task) {
        return res
          .status(404)
          .json({ message: "Task not found or unauthorized" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Delete task error:", error);
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid task ID format" });
      }
      res.status(500).json({ message: "Server error while deleting task" });
    }
  }

  // statistical endpoints
  static async getStats(req, res) {
    try {
      const stats = await Task.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(req.userId) } },
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
            },
            pendingTasks: {
              $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] },
            },
            totalEstimatedHours: { $sum: "$estimatedHours" },
            averageEstimatedHours: { $avg: "$estimatedHours" },
            priorityBreakdown: { $push: "$priority" },
          },
        },
      ]);

      const result = stats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalEstimatedHours: 0,
        averageEstimatedHours: 0,
        priorityBreakdown: [],
      };

      // Priority breakdown counts
      const priorities = result.priorityBreakdown || [];
      result.priorityCount = {
        low: priorities.filter((p) => p === "low").length,
        medium: priorities.filter((p) => p === "medium").length,
        high: priorities.filter((p) => p === "high").length,
        urgent: priorities.filter((p) => p === "urgent").length,
      };
      delete result.priorityBreakdown;

      res.json(result);
    } catch (error) {
      console.error("Get stats error:", error);
      res
        .status(500)
        .json({ message: "Server error while fetching statistics" });
    }
  }
}

module.exports = TaskController;