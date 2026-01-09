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


//for finding 
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId })
      .populate("categoryId", "name type")
      .sort({ date: -1 });

    res.status(200).json(expenses);

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