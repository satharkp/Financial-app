const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {categoryWiseTransactions,monthlyTransactions,dateRangeTransactions,netBalance} = require("../controllers/analytics.controller");

router.use(authMiddleware);


router.get("/category", categoryWiseTransactions);
router.get("/monthly", monthlyTransactions);
router.get("/range", dateRangeTransactions);
router.get("/net-balance", netBalance);

module.exports = router;
