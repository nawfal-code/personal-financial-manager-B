import Goal from "../model/goalModel.js";

// CREATE GOAL
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, durationValue, durationUnit, description } = req.body;

    if (!title || !targetAmount || !durationValue || !durationUnit) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const goal = await Goal.create({
      userId: req.user,
      title,
      targetAmount,
      durationValue,
      durationUnit,
      description,
    });

    res.status(201).json({ message: "Goal created", goal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET GOALS
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE SAVED AMOUNT AND HISTORY
export const updateGoalProgress = async (req, res) => {
  try {
    const { savedAmount } = req.body;

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user });
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (savedAmount < 0)
      return res.status(400).json({ message: "Saved amount cannot be negative" });

    if (savedAmount > goal.targetAmount)
      return res.status(400).json({ message: "Saved amount cannot exceed target" });

    // 🔹 Calculate added amount
    const addedAmount = savedAmount - goal.savedAmount;

    // 🔹 Update savedAmount
    goal.savedAmount = savedAmount;

    // 🔹 Add to history if any
    if (addedAmount > 0) {
      goal.savingsHistory.push({ amount: addedAmount });
    }

    await goal.save();

    res.status(200).json({ message: "Goal progress updated", goal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// EDIT GOAL DETAILS
export const editGoal = async (req, res) => {
  try {
    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Goal not found" });

    res.json({ message: "Goal updated", goal: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE GOAL
export const deleteGoal = async (req, res) => {
  try {
    const deleted = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!deleted) return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
