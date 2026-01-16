import Budget from "../model/budgetModel.js";
import Expense from "../model/expenseModel.js";

// Create budget
export const createBudget = async (req, res) => {
  try {
    const { category, limitAmount, period, startDate } = req.body;

    if (!category || !category.trim()) return res.status(400).json({ message: "Category required" });
    if (!limitAmount || limitAmount <= 0) return res.status(400).json({ message: "Invalid limit amount" });

    const budget = new Budget({
      userId: req.user,
      category,
      limitAmount,
      period,
      startDate
    });

    await budget.save();
    res.status(201).json({ message: "Budget created", budget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all budgets
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user }).sort({ createdAt: -1 });

    // Add usedPercent for charts
    const budgetsWithPercent = budgets.map(b => ({
      ...b._doc,
      usedPercent: ((b.spentAmount / b.limitAmount) * 100).toFixed(2)
    }));

    res.json(budgetsWithPercent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update spent amount for a budget
export const updateBudgetSpentAmount = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const now = new Date();
    let start, end;
    if (budget.period === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (budget.period === "yearly") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    }

    const expenses = await Expense.find({
      userId: req.user,
      category: budget.category,
      date: { $gte: start, $lte: end },
    });

    budget.spentAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    await budget.save();

    res.json({ message: "Budget updated", budget });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete budget
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update budget
export const updateBudget = async (req, res) => {
  try {
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Budget not found" });

    res.json({ message: "Budget updated", budget: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
