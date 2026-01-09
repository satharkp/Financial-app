const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// CATEGORY WISE
exports.categoryWiseExpenses = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId)
        }
      },
      {
        $group: {
          _id: "$categoryId",
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: { $ifNull: ["$category.name", "Unknown"] },
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
exports.monthlyExpenses = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId)
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
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
exports.dateRangeExpenses = async (req, res) => {
  try {
    const { from, to } = req.query;

    // validate query params
    if (!from || !to) {
      return res.status(400).json({
        message: "from and to dates are required"
      });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);

    // include full end day
    endDate.setHours(23, 59, 59, 999);

    const result = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
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