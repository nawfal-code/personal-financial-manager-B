// routes/goalRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createGoal,
  getGoals,
  updateGoalProgress,
  deleteGoal
} from "../controllers/goalController.js";

const router = express.Router();

/* ==========================
   PROTECT ALL GOAL ROUTES
========================== */
router.use(authMiddleware);

/* ==========================
   GOAL ROUTES
========================== */

// 1️⃣ Create a financial goal
router.post("/", createGoal);

// 2️⃣ Get all goals of logged-in user
router.get("/", getGoals);

// 3️⃣ Update goal progress (savedAmount)
router.put("/:id", updateGoalProgress);

// 4️⃣ Delete goal
router.delete("/:id", deleteGoal);

export default router;
