// routes/reportRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  expenseByCategory,
  monthlyExpenses,
  budgetStatus,
  goalProgress,
  getIncome
} from "../controllers/reportController.js";

const router = express.Router();

/* ==========================
   PROTECT ALL REPORT ROUTES
========================== */
router.use(authMiddleware);

/* ==========================
   REPORT ROUTES
========================== */

// 1️⃣ Expenses grouped by category
router.get("/expenses/category", expenseByCategory);

// 2️⃣ Monthly expense report
router.get("/expenses/monthly", monthlyExpenses);

// 3️⃣ Income report
router.get("/income", getIncome);

// 4️⃣ Budget status report
router.get("/budgets", budgetStatus);

// 5️⃣ Goal progress report
router.get("/goals", goalProgress);

export default router;
