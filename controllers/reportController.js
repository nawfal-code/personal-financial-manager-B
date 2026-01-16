import mongoose from "mongoose";
import Expense from "../model/expenseModel.js";
import Income from "../model/incomeModel.js";
import Budget from "../model/budgetModel.js";
import Goal from "../model/goalModel.js";

// Safe ObjectId creator
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

/* 1️⃣ Expense by Category */
export const expenseByCategory = async (req, res) => {
  try {
    if (!req.user) return res.status(400).json({ message: "User not found" });

    const expenses = await Expense.aggregate([
      { $match: { userId: toObjectId(req.user) } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $project: { category: "$_id", total: 1, _id: 0 } }
    ]);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 2️⃣ Monthly Expenses Summary */
export const monthlyExpenses = async (req, res) => {
  try {
    const userId = toObjectId(req.user);

    const expenses = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          _id: 0,
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);

    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 3️⃣ Budget Status (with % used) */
export const budgetStatus = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user }).lean();

    const enhanced = budgets.map((b) => ({
      ...b,
      percentUsed: b.limitAmount
        ? Math.min(((b.spentAmount / b.limitAmount) * 100), 100).toFixed(1)
        : 0,
    }));

    res.status(200).json(enhanced);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 4️⃣ Goal Progress (with % completed) */
export const goalProgress = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user }).lean();

    const enhanced = goals.map((g) => ({
      ...g,
      percentCompleted: ((g.savedAmount / g.targetAmount) * 100).toFixed(1),
    }));

    res.status(200).json(enhanced);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* 5️⃣ Income list + total income */
export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user }).sort({ date: -1 }).lean();

    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);

    res.status(200).json({
      totalIncome,
      records: income,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
