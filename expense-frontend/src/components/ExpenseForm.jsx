import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ExpenseForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  // load categories
  useEffect(() => {
    api.get("/categories").then(res => {
      setCategories(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !categoryId) {
      alert("Amount and category are required");
      return;
    }

    await api.post("/expenses", {
      amount,
      categoryId,
      note
    });

    setAmount("");
    setNote("");
    setCategoryId("");

    if (onSuccess) onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 space-y-5"
    >
      <h3 className="text-lg font-semibold text-sky-700">
        Add Expense
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        
        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Amount
          </label>
          <input
            type="number"
            placeholder="₹ 0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Note
          </label>
          <input
            placeholder="Optional note"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition shadow-sm"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}