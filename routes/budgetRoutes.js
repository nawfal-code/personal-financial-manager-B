// routes/budgetRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createBudget,
  getBudgets,
  updateBudgetSpentAmount,
  updateBudget,
  deleteBudget
} from "../controllers/budgetController.js";

const router = express.Router();

/* ==========================
   PROTECT ALL BUDGET ROUTES
========================== */
router.use(authMiddleware);

/* ==========================
   BUDGET ROUTES
========================== */

// 1️⃣ Create new budget
router.post("/", createBudget);

// 2️⃣ Get all budgets of logged user
router.get("/", getBudgets);

// 3️⃣ Recalculate spent amount on a budget
router.patch("/:id/recalculate", updateBudgetSpentAmount);

// 4️⃣ Update budget fields (category, limit etc.)
router.put("/:id", updateBudget);

// 5️⃣ Delete budget
router.delete("/:id", deleteBudget);

export default router;
