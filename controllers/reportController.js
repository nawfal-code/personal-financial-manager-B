import mongoose from "mongoose";
import Expense from "../model/expenseModel.js";
import Income from "../model/incomeModel.js";
import Budget from "../model/budgetModel.js";
import Goal from "../model/goalModel.js";

/* =========================
   1️⃣ EXPENSE BY CATEGORY
========================= */
export const expenseByCategory = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
    ]);

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   2️⃣ MONTHLY EXPENSES
========================= */
export const monthlyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   3️⃣ INCOME REPORT
========================= */
export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user }).lean();
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

    res.json({
      totalIncome,
      records: income,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   4️⃣ ✅ BUDGET STATUS REPORT (MENTOR EXPECTED)
========================= */
export const budgetStatus = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user }).lean();

    const report = budgets.map((b) => ({
      category: b.category,
      limitAmount: b.limitAmount,
      spentAmount: b.spentAmount,
      remaining: b.limitAmount - b.spentAmount,
      percentUsed: b.limitAmount
        ? ((b.spentAmount / b.limitAmount) * 100).toFixed(1)
        : 0,
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   5️⃣ ✅ GOAL PROGRESS REPORT (MENTOR EXPECTED)
========================= */
export const goalProgress = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user }).lean();

    const report = goals.map((g) => ({
      title: g.title,
      targetAmount: g.targetAmount,
      savedAmount: g.savedAmount,
      remaining: g.targetAmount - g.savedAmount,
      percentCompleted: g.targetAmount
        ? ((g.savedAmount / g.targetAmount) * 100).toFixed(1)
        : 0,
    }));

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
