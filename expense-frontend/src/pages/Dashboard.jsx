import { useEffect, useState } from "react";
import api from "../api/axios";
import ExpenseForm from "../components/ExpenseForm";
import LogoutButton from "../components/LogoutButton";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const loadExpenses = (filters = {}, pageNumber = 1) => {
    const params = new URLSearchParams();

    params.append("page", pageNumber);
    params.append("limit", limit);

    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    api.get(`/expenses?${params.toString()}`)
      .then(res => {
        setExpenses(res.data.expenses);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      });
  };

  const deleteExpense = async (id) => {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;

    await api.delete(`/expenses/${id}`);
    loadExpenses({}, page);
  };

  useEffect(() => {
    loadExpenses({}, 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-6 py-8">

        <h2 className="text-2xl font-semibold mb-6 text-sky-700">
          Dashboard
        </h2>

        <div className="bg-white rounded-xl p-6 shadow-xl mb-8">
          <ExpenseForm onSuccess={loadExpenses} />
        </div>


        <h3 className="mt-6 mb-4 text-lg font-semibold text-sky-700">
          Expenses
        </h3>
        {expenses.map(exp => (
          <div
            key={exp._id}
            className="bg-sky-50 border border-sky-100 rounded-xl p-5 mb-4 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-sky-600 font-medium">
                {exp.categoryId?.name}
              </p>
              <p className="text-xl font-semibold text-gray-900">
                ₹ {exp.amount}
              </p>
              {exp.note && (
                <p className="text-sm text-gray-500">
                  {exp.note}
                </p>
              )}
            </div>

            <button
              onClick={() => deleteExpense(exp._id)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 transition border border-red-100"
            >
              Delete
            </button>
          </div>
        ))}

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => loadExpenses({}, page - 1)}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => loadExpenses({}, page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}