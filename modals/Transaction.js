const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
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

// Core indexes for transaction queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, categoryId: 1 });
transactionSchema.index({ userId: 1, amount: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });

module.exports = mongoose.model("transaction", transactionSchema);