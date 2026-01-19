require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: MONGO_URI or JWT_SECRET is not defined in .env file");
  process.exit(1);
}

const app = express();

/* -------------------- Middleware -------------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://fintrack-frontend.vercel.app",
  "https://expense-frontend-five-rouge.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    } else {
      return callback(null, new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// app.options("*", cors());

app.use(express.json());

// Database 
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