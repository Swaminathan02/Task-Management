// routes/taskRoutes.js
const express = require("express");
const TaskController = require("../controllers/TaskController.js");
const validateUser = require("../middleware/validateUser.js");

const router = express.Router();

router.get("/", validateUser, TaskController.getTasks);
router.post("/",  validateUser,TaskController.createTask);
router.put("/:id", validateUser, TaskController.updateTask);
router.delete("/:id", validateUser, TaskController.deleteTask);
router.get("/stats", validateUser, TaskController.getStats);

module.exports = router;
