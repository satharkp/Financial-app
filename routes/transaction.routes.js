const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} = require("../controllers/Transaction.controller");

router.use(authMiddleware);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;