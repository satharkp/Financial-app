const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require("../controllers/category.controller");


router.use(authMiddleware);

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;