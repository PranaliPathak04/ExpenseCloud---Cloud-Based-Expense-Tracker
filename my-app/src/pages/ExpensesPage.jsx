import { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import {
  MdFastfood,
  MdDirectionsCar,
  MdLocalMall,
  MdMedicalServices,
  MdMovie,
  MdLightbulb,
  MdCategory,
} from "react-icons/md";

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const CAT_ICONS = {
  Food: <MdFastfood />,
  Transport: <MdDirectionsCar />,
  Shopping: <MdLocalMall />,
  Health: <MdMedicalServices />,
  Entertainment: <MdMovie />,
  Bills: <MdLightbulb />,
  Other: <MdCategory />,
};

const ALL_CATS = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Bills",
  "Other",
];

export default function ExpensesPage({ onAddClick }) {
  const { expenses, loading, deleteExpense } = useExpenses();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  if (loading) return <div className="loading">Loading...</div>;

  const filtered = expenses.filter((e) => {
    const matchCat = filter === "All" || e.category === filter;
    const matchSearch = e.description
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All expenses</h1>
        <button className="add-btn-lg" onClick={onAddClick}>
          + Add expense
        </button>
      </div>

      <div className="filters">
        <input
          className="search-input"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="cat-filters">
          {ALL_CATS.map((c) => (
            <button
              key={c}
              className={`cat-chip ${filter === c ? "active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {CAT_ICONS[c] && <span>{CAT_ICONS[c]} </span>}
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="expense-list">
        {filtered.length === 0 ? (
          <div className="empty-state">No expenses match your filters.</div>
        ) : (
          filtered.map((e) => (
            <div key={e.id} className="expense-row">
              <div className="cat-icon">{CAT_ICONS[e.category] || "📦"}</div>
              <div className="exp-info">
                <div className="exp-name">{e.description}</div>
                <div className="exp-meta">
                  {e.category} · {e.date}
                </div>
                {e.receiptUrl && (
                  <a
                    href={e.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="receipt-link"
                  >
                    📎 View receipt
                  </a>
                )}
              </div>
              <div className="exp-amount">
                ₹{Math.round(e.amount).toLocaleString("en-IN")}
              </div>
              <button
                className="delete-btn"
                onClick={() => deleteExpense(e.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
