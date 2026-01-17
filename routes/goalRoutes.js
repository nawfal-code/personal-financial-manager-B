import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createGoal,
  getGoals,
  updateGoalProgress,
  editGoal,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

// 🔐 Protect all goal routes
router.use(authMiddleware);

// Create goal
router.post("/", createGoal);

// Get goals
router.get("/", getGoals);

// Update progress
router.put("/:id", updateGoalProgress);

// 🆕 Edit goal
router.patch("/:id", editGoal);

// Delete goal
router.delete("/:id", deleteGoal);

export default router;
