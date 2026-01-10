const Transaction = require("../modals/Transaction");
const mongoose = require("mongoose");

// CATEGORY WISE
exports.categoryWiseTransactions = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          type: "expense"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// MONTHLY
exports.monthlyTransactions = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type"
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DATE RANGE ANALYTICS
exports.dateRangeTransactions = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        message: "from and to dates are required"
      });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          type: "expense",
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          count: 1
        }
      }
    ]);

    res.status(200).json(
      result[0] || { totalAmount: 0, count: 0 }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// NET BALANCE (Income - Expense)
exports.netBalance = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          type: { $in: ["income", "expense"] }
        }
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0;
    let expense = 0;

    result.forEach(r => {
      if (r._id === "income") income = r.totalAmount;
      if (r._id === "expense") expense = r.totalAmount;
    });

    res.json({
      income,
      expense,
      netBalance: income - expense
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};