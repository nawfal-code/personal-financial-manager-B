// routes/expenseRoutes.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addExpense,
  getExpenses,
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


// 4️⃣ Update an expense
router.put("/:id", updateExpense);

// 5️⃣ Delete an expense
router.delete("/:id", deleteExpense);

export default router;

