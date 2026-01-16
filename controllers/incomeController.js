import Income from "../model/incomeModel.js";

// Add income
export const addIncome = async (req, res) => {
  try {
    const { amount, source, date, description } = req.body;

    // validation
    if (!amount || !source) {
      return res.status(400).json({ message: "Amount and source are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const income = await Income.create({
      userId: req.user,
      amount,
      source,
      description: description || "",
      date: date ? new Date(date) : new Date()
    });

    return res.status(201).json({
      message: "Income added successfully",
      income
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get all income for current user
export const getIncome = async (req, res) => {
  try {
    const income = await Income.find({ userId: req.user })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(income);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update income
export const updateIncome = async (req, res) => {
  try {
    const { amount } = req.body;

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const updated = await Income.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(200).json({
      message: "Income updated",
      income: updated
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Delete income
export const deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });

    if (!deleted) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(200).json({ message: "Income deleted successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
