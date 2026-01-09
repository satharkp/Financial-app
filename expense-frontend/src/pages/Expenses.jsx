import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ExpenseFilters from "../components/ExpenseFilters";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const loadExpenses = (filters = {}, pageNumber = 1) => {
    const params = new URLSearchParams();
    params.append("page", pageNumber);
    params.append("limit", limit);


    if (filters.categoryId) params.append("categoryId", filters.categoryId);
if (filters.from) params.append("from", filters.from);
if (filters.to) params.append("to", filters.to);

if (filters.sort === "latest") {
  params.append("sortBy", "createdAt");
  params.append("order", "desc");
}
if (filters.sort === "oldest") {
  params.append("sortBy", "createdAt");
  params.append("order", "asc");
}
if (filters.sort === "amountDesc") {
  params.append("sortBy", "amount");
  params.append("order", "desc");
}
if (filters.sort === "amountAsc") {
  params.append("sortBy", "amount");
  params.append("order", "asc");
}

    api.get(`/expenses?${params.toString()}`).then(res => {
      setExpenses(res.data.expenses);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    });
  };

  useEffect(() => {
    loadExpenses({}, 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-sky-700 mb-6">
          All Expenses
        </h2>

        <div className="bg-white border border-sky-100 rounded-xl p-5 shadow-lg mb-8">
          <ExpenseFilters onFilter={(filters) => loadExpenses(filters, 1)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {expenses.map(exp => (
            <div
              key={exp._id}
              className="bg-white border border-sky-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex items-center justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-1 rounded-full bg-sky-400 mt-1" />
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wide text-sky-500 font-semibold">
                    {exp.categoryId?.name}
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    ₹ {exp.amount}
                  </p>

                  {exp.note && (
                    <p className="text-sm text-gray-500">
                      {exp.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
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
