import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    savedAmount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.targetAmount;
        },
        message: "Saved amount cannot exceed target amount",
      },
    },

    durationValue: {
      type: Number,
      required: true,
      min: 1,
    },

    durationUnit: {
      type: String,
      enum: ["months", "years"],
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    description: {
      type: String,
      default: "",
    },

    // 🔹 Savings History
    savingsHistory: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1 });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
