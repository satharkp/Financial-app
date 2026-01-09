const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false
  }
);

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ categoryId: 1 });

module.exports = mongoose.model("Expense", expenseSchema);