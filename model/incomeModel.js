import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    source: {
      type: String,
      enum: ["Salary", "Business", "Investments", "Other"],
      required: true,
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for faster reporting
incomeSchema.index({ userId: 1, date: -1 });

const Income = mongoose.model("Income", incomeSchema);

export default Income;
