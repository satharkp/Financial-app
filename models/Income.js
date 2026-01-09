const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    source: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true, strict: true}
);

incomeSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Income", incomeSchema);