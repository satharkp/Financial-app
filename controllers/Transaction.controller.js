const Transaction = require("../models/Transaction");


//for creating
exports.createTransaction = async (req, res) => {
  try {
    const { amount, categoryId, type, note, date } = req.body;

    if (!amount || !categoryId || !type) {
      return res.status(400).json({
        message: "Amount, categoryId and type are required"
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Invalid transaction type"
      });
    }

    const transaction = await Transaction.create({
      amount,
      type,
      categoryId,
      note,
      date,
      userId: req.userId
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET EXPENSES WITH PAGINATION + FILTERS + SORTING
exports.getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // base filter
    const filter = { userId: req.userId };

    // filter by category
    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    // filter by transaction type
    if (req.query.type && ["income", "expense"].includes(req.query.type)) {
      filter.type = req.query.type;
    }

    // filter by date range
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) {
        const fromDate = new Date(req.query.from);
        if (isNaN(fromDate.getTime())) {
          return res.status(400).json({ message: "Invalid 'from' date format" });
        }
        filter.date.$gte = fromDate;
      }
      if (req.query.to) {
        const endDate = new Date(req.query.to);
        if (isNaN(endDate.getTime())) {
          return res.status(400).json({ message: "Invalid 'to' date format" });
        }
        endDate.setHours(23, 59, 59, 999);
        filter.date.$lte = endDate;
      }
    }

    // sorting (SAFE)
    const sortBy = ["date", "amount"].includes(req.query.sortBy)
      ? req.query.sortBy
      : "date";

    const order = req.query.order === "asc" ? 1 : -1;

    const sort = { [sortBy]: order };

    const [expenses, total] = await Promise.all([
      Transaction.find(filter)
        .populate("categoryId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Transaction.countDocuments(filter)
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      sortBy,
      order: order === 1 ? "asc" : "desc",
      expenses
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//to delete
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Expense not found or not authorized"
      });
    }

    await transaction.deleteOne();

    res.status(200).json({
      message: "Transaction deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// to update expense
exports.updateTransaction = async (req, res) => {
  try {
    const { amount, categoryId, type, note, date } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Expense not found or not authorized"
      });
    }

    if (type) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          message: "Invalid transaction type"
        });
      }
      transaction.type = type;
    }

    if (amount !== undefined) transaction.amount = amount;
    if (categoryId) transaction.categoryId = categoryId;
    if (note !== undefined) transaction.note = note;
    if (date) transaction.date = date;

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};