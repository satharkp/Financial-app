const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {categoryWiseExpenses,monthlyExpenses,dateRangeExpenses } = require("../controllers/analytics.controller");

router.use(authMiddleware);


router.get("/category", categoryWiseExpenses);
router.get("/monthly", monthlyExpenses);
router.get("/range", dateRangeExpenses);

module.exports = router;
