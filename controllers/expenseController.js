// controllers/expenseController.js
import Expense from "../model/expenseModel.js";
import mongoose from "mongoose";

// ==========================
// ADD EXPENSE
// ==========================
export const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date, isRecurring, recurringType } = req.body;

    if (!amount || Number(amount) <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    if (!category || !category.trim())
      return res.status(400).json({ message: "Category required" });

    const newExpense = new Expense({
      userId: req.user, // from authMiddleware
      amount: Number(amount),
      category,
      description: description || "",
      date: date ? new Date(date) : new Date(),
      isRecurring: !!isRecurring,
      recurringType: recurringType || "monthly",
    });

    await newExpense.save();
    res.status(201).json({ message: "Expense added", newExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// GET ALL USER EXPENSES
// ==========================
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// FILTER EXPENSES
// ==========================
export const filterExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, minAmount, maxAmount } = req.query;

    const query = { userId: req.user };

    if (category) query.category = { $regex: category.trim(), $options: "i" };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (minAmount || maxAmount) query.amount = {};
    if (minAmount) query.amount.$gte = Number(minAmount);
    if (maxAmount) query.amount.$lte = Number(maxAmount);

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// DELETE EXPENSE
// ==========================
export const deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// UPDATE EXPENSE
// ==========================
export const updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Expense not found" });

    res.status(200).json({ message: "Expense updated", expense: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==========================
// AGGREGATE EXPENSES BY CATEGORY (for charts)
// ==========================
export const expenseByCategory = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
