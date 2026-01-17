import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createBudget,
  getBudgets,
  updateBudgetSpentAmount,
  updateBudget,
  deleteBudget,
  recalculateAllBudgets,
} from "../controllers/budgetController.js";

const router = express.Router();

router.use(authMiddleware);

// Create budget
router.post("/", createBudget);

// Get budgets
router.get("/", getBudgets);

// Recalculate single budget
router.patch("/:id/recalculate", updateBudgetSpentAmount);

// Recalculate ALL budgets 
router.patch("/recalculate-all", recalculateAllBudgets);

// Update budget
router.put("/:id", updateBudget);

// Delete budget
router.delete("/:id", deleteBudget);

export default router;
