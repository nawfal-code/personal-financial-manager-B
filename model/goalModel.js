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
        validator: function(value) {
          return value <= this.targetAmount;
        },
        message: "Saved amount cannot exceed target amount",
      },
    },
    deadline: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Index for faster dashboard queries
goalSchema.index({ userId: 1, deadline: 1 });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;
