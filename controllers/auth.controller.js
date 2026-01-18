const User = require("../models/User");
const Category = require("../models/Category");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    // Seed default categories
    const defaultCategories = ["Food", "Travel", "Utilities", "Other"];
    const categoryDocs = defaultCategories.map(catName => ({
      name: catName,
      userId: user._id
    }));

    // We use Category model directly here. Need to require it at the top if not present, but better to dynamic require or assume it's available?
    // Wait, I need to check imports. The file has `const User = require("../models/User");`.
    // I need to import Category.

    // I'll update the imports in a separate instruction or same block if I can see the top.
    // I can't see the top in this block scope, but I know it's there.
    // I will do two edits: one for import, one for logic.
    // Actually, I can use require inside the function or just add it at the top. 
    // Let's stick to doing the logic here and I will add the require statement at the top in a second call or same call if possible.
    // Since I can't edit non-contiguous lines, I'll do two calls.

    // Second thought: I'll use `require("../models/Category")` inside the function or file to be safe? 
    // No, standard practice is top level.

    // I will replace the LOGIC first.

    await Category.insertMany(categoryDocs);

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  try {
    //entering password and email
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    //finding user email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //check password 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //token creation
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};