const Category = require("../models/Category");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");

// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required"
      });
    }

    const category = await Category.create({
      name,
      type,
      userId: req.userId
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.status(200).json(categories);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE CATEGORY (SAFE)
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findOne({
      _id: categoryId,
      userId: req.userId
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found or not authorized"
      });
    }

    const expenseExists = await Expense.exists({
      categoryId: new mongoose.Types.ObjectId(categoryId),
      userId: req.userId
    });

    if (expenseExists) {
      return res.status(400).json({
        message: "Cannot delete category. Expenses exist under this category."
      });
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};