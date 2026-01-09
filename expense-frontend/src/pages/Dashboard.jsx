import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get("/expenses?page=1&limit=5")
      .then(res => setExpenses(res.data.expenses));
  }, []);

  return (
    <div>
      <h2>Recent Expenses</h2>
      {expenses.map(e => (
        <div key={e._id}>
          <b>{e.categoryId?.name}</b> – ₹{e.amount}
        </div>
      ))}
    </div>
  );
}