import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },
    category: {
      type: String,
      enum: ["Groceries", "Food", "Rent", "Transport", "Shopping", "Other"],
      required: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
      default: "monthly",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);



const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
