import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  expenseByCategory,
  monthlyExpenses,
  budgetStatus,
  goalProgress,
  getIncome,
} from "../controllers/reportController.js";

const router = express.Router();

/* ==========================
   PROTECT ALL ROUTES
========================== */
router.use(authMiddleware);

/* ==========================
   REPORT ROUTES
========================== */

// Expenses
router.get("/expenses/category", expenseByCategory);
router.get("/expenses/monthly", monthlyExpenses);

// Income
router.get("/income", getIncome);

// ✅ Budget Report
router.get("/budgets", budgetStatus);

// ✅ Goal Report
router.get("/goals", goalProgress);

export default router;
