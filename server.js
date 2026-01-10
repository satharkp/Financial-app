require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/protected", require("./routes/protected.routes"));
app.use("/api/transactions", require("./routes/transaction.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});