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

// CREATE
router.post("/", createBudget);

// READ
router.get("/", getBudgets);

router.patch("/recalculate-all", recalculateAllBudgets);

// THEN DYNAMIC ROUTES
router.patch("/:id/recalculate", updateBudgetSpentAmount);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

export default router;
