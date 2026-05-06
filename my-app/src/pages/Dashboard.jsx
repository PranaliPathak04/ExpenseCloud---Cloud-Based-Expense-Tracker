import { useExpenses } from "../hooks/useExpenses";
import { useAuth } from "../hooks/useAuth";
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

export default function Dashboard({ onAddClick }) {
  const { user } = useAuth();
  const { expenses, loading, totalThisMonth, totalByCategory } = useExpenses();

  if (loading) return <div className="loading">Loading...</div>;

  const recent = expenses.slice(0, 5);
  const catTotals = totalByCategory();
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome back, {user.displayName?.split(" ")[0] || "there"}
          </h1>
          <p className="page-sub">Here's your spending overview</p>
        </div>
        <button className="add-btn-lg" onClick={onAddClick}>
          + Add expense
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">This month</div>
          <div className="stat-value">{fmt(totalThisMonth())}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total expenses</div>
          <div className="stat-value">{expenses.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Top category</div>
          <div className="stat-value">
            {topCat ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {CAT_ICONS[topCat[0]]}
                <span>{topCat[0]}</span>
              </div>
            ) : (
              "—"
            )}
          </div>
        </div>
      </div>

      <h2 className="section-title">Recent transactions</h2>
      <div className="expense-list">
        {recent.length === 0 ? (
          <div className="empty-state">
            No expenses yet. Add your first one!
          </div>
        ) : (
          recent.map((e) => (
            <div key={e.id} className="expense-row">
              <div className="cat-icon">{CAT_ICONS[e.category] || "📦"}</div>
              <div className="exp-info">
                <div className="exp-name">{e.description}</div>
                <div className="exp-meta">
                  {e.category} · {e.date}
                </div>
              </div>
              <div className="exp-amount">{fmt(e.amount)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
