require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* -------------------- Middleware -------------------- */
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fintrack-frontend.vercel.app",
    "https://expense-frontend-five-rouge.vercel.app"
  ],
  credentials: true
}));

/* -------------------- Database -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

/* -------------------- Routes -------------------- */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/transactions", require("./routes/transaction.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));
app.use("/api/protected", require("./routes/protected.routes"));

/* -------------------- Server -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});