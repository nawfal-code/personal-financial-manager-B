import Expense from "../model/expenseModel.js";
import mongoose from "mongoose";

// ADD EXPENSE
export const addExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    if (!category || !category.trim())
      return res.status(400).json({ message: "Category required" });

    const expense = new Expense({
      userId: req.user,
      amount,
      category: category.trim(),
      description,
      date,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET EXPENSES
export const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
  res.json(expenses);
};

// UPDATE
export const updateExpense = async (req, res) => {
  const updated = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated)
    return res.status(404).json({ message: "Expense not found" });

  res.json(updated);
};

// DELETE
export const deleteExpense = async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// CATEGORY AGGREGATION
export const expenseByCategory = async (req, res) => {
  const data = await Expense.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(req.user) } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);
  res.json(data);
};
