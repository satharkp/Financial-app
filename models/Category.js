const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true, strict: true }
);

// User-specific category lookup
categorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);