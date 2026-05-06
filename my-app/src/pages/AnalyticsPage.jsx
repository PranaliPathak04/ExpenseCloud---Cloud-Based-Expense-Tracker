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
// const CAT_ICONS = {
//   Food: "🍔",
//   Transport: "🚗",
//   Shopping: "🛍️",
//   Health: "💊",
//   Entertainment: "🎬",
//   Bills: "💡",
//   Other: "📦",
// };
const CAT_ICONS = {
  Food: <MdFastfood />,
  Transport: <MdDirectionsCar />,
  Shopping: <MdLocalMall />,
  Health: <MdMedicalServices />,
  Entertainment: <MdMovie />,
  Bills: <MdLightbulb />,
  Other: <MdCategory />,
};
const CAT_COLORS = {
  Food: "#e94560",
  Transport: "#0f3460",
  Shopping: "#FFA611",
  Health: "#1D9E75",
  Entertainment: "#7F77DD",
  Bills: "#378ADD",
  Other: "#888780",
};

export default function AnalyticsPage() {
  const { expenses, loading, totalByCategory, totalThisMonth } = useExpenses();

  if (loading) return <div className="loading">Loading...</div>;

  const catTotals = totalByCategory();
  const total = Object.values(catTotals).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  // Monthly breakdown
  const byMonth = expenses.reduce((acc, e) => {
    const m = e.date?.slice(0, 7);
    if (m) acc[m] = (acc[m] || 0) + e.amount;
    return acc;
  }, {});
  const months = Object.entries(byMonth)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 6);

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: 20 }}>
        Analytics
      </h1>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">This month</div>
          <div className="stat-value">{fmt(totalThisMonth())}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">All time total</div>
          <div className="stat-value">{fmt(total)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories used</div>
          <div className="stat-value">{sorted.length}</div>
        </div>
      </div>

      <h2 className="section-title">By category</h2>
      <div className="analytics-bars">
        {sorted.map(([cat, amt]) => (
          <div key={cat} className="bar-row">
            <div className="bar-label">
              {CAT_ICONS[cat]} {cat}
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${Math.round((amt / total) * 100)}%`,
                  background: CAT_COLORS[cat] || "#888",
                }}
              />
            </div>
            <div className="bar-amount">{fmt(amt)}</div>
            <div className="bar-pct">{Math.round((amt / total) * 100)}%</div>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: 28 }}>
        Monthly history
      </h2>
      <div className="month-list">
        {months.map(([month, amt]) => (
          <div key={month} className="month-row">
            <div className="month-label">{month}</div>
            <div className="month-amount">{fmt(amt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
