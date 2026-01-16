import Goal from "../model/goalModel.js";

// Create Goal
export const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, description } = req.body;

    // basic validation
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: "Title, target amount and deadline are required" });
    }

    // numeric validation
    if (targetAmount <= 0) {
      return res.status(400).json({ message: "Target amount must be positive" });
    }

    // deadline check (future date)
    if (new Date(deadline) < new Date()) {
      return res.status(400).json({ message: "Deadline must be in the future" });
    }

    const goal = await Goal.create({
      userId: req.user,
      title,
      targetAmount,
      deadline,
      description: description || "",
      savedAmount: 0
    });

    res.status(201).json({
      message: "Goal created successfully",
      goal
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get all goals for user
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user }).sort({ createdAt: -1 }).lean();
    return res.status(200).json(goals);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update saved amount / progress
export const updateGoalProgress = async (req, res) => {
  try {
    const { savedAmount } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    // amount validation
    if (savedAmount < 0) {
      return res.status(400).json({ message: "Saved amount cannot be negative" });
    }

    // cannot exceed target
    if (savedAmount > goal.targetAmount) {
      return res.status(400).json({ message: "Saved amount cannot exceed target amount" });
    }

    goal.savedAmount = savedAmount;
    await goal.save();

    res.status(200).json({
      message: "Goal progress updated",
      goal
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete goal
export const deleteGoal = async (req, res) => {
  try {
    const deleted = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });

    if (!deleted) {
      return res.status(404).json({ message: "Goal not found" });
    }

    return res.status(200).json({ message: "Goal deleted successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
