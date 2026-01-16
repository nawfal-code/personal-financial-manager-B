// routes/expenseRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addExpense,
  getExpenses,
  filterExpenses,
  updateExpense,
  deleteExpense
} from "../controllers/expenseController.js";

const router = express.Router();

/* ==========================
   PROTECT ALL EXPENSE ROUTES
========================== */
router.use(authMiddleware);

/* ==========================
   EXPENSE ROUTES
========================== */

// 1️⃣ Create expense
router.post("/", addExpense);

// 2️⃣ Get all expenses of logged in user
router.get("/", getExpenses);

// 3️⃣ Filter by category/date (uses query params)
router.get("/filter", filterExpenses);

// 4️⃣ Update an expense
router.put("/:id", updateExpense);

// 5️⃣ Delete an expense
router.delete("/:id", deleteExpense);

export default router;
