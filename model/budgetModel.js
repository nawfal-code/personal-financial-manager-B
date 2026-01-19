import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    limitAmount: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  { timestamps: true }
);

// Index for faster reporting queries
budgetSchema.index({ userId: 1, category: 1, period: 1 });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;

