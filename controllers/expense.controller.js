const Expense = require("../models/Expense");


//for creating
exports.createExpense = async (req, res) => {
  try {
    const { amount, categoryId, note, date } = req.body;

    if (!amount || !categoryId) {
      return res.status(400).json({
        message: "Amount and categoryId are required"
      });
    }

    const expense = await Expense.create({
      amount,
      categoryId,
      note,
      date,
      userId: req.userId  
    });

    res.status(201).json({
      message: "Expense created successfully",
      expense
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET EXPENSES WITH PAGINATION + FILTERS + SORTING
exports.getExpenses = async (req, res) => {
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

    // filter by date range
    if (req.query.from || req.query.to) {
      filter.date = {};
      if (req.query.from) {
        filter.date.$gte = new Date(req.query.from);
      }
      if (req.query.to) {
        const end = new Date(req.query.to);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    // sorting (SAFE)
    const sortBy = ["date", "amount"].includes(req.query.sortBy)
      ? req.query.sortBy
      : "date";

    const order = req.query.order === "asc" ? 1 : -1;

    const sort = { [sortBy]: order };

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .populate("categoryId", "name type")
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Expense.countDocuments(filter)
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
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found or not authorized"
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      message: "Expense deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// to update expense
exports.updateExpense = async (req, res) => {
  try {
    const { amount, categoryId, note, date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId 
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found or not authorized"
      });
    }

    if (amount !== undefined) expense.amount = amount;
    if (categoryId) expense.categoryId = categoryId;
    if (note !== undefined) expense.note = note;
    if (date) expense.date = date;

    await expense.save();

    res.status(200).json({
      message: "Expense updated successfully",
      expense
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};