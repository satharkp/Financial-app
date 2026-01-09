const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {createExpense,getExpenses,deleteExpense,updateExpense} = require("../controllers/expense.controller");

router.use(authMiddleware);
router.post("/", createExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);
router.put("/:id", updateExpense);

module.exports = router;