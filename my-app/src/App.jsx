import { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ExpensesPage from "./pages/ExpensesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AddExpenseModal from "./components/AddExpenseModal";
import "./App.css";
import {
  MdDashboard,
  MdCreditCard,
  MdAnalytics,
  MdAdd,
  MdLogout,
  MdAccountBalanceWallet,
} from "react-icons/md";
function AppShell() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);

  if (!user) return <LoginPage />;

  const pages = {
    dashboard: Dashboard,
    expenses: ExpensesPage,
    analytics: AnalyticsPage,
  };
  const Page = pages[tab];

  return (
    <div className="app-shell">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">
            <MdAccountBalanceWallet size={24} />
          </span>
          <span className="logo-name">ExpenseCloud</span>
        </div>
        <div className="header-right">
          <button className="add-btn" onClick={() => setShowAdd(true)}>
            + Add expense
          </button>
          <img
            src={user.photoURL || ""}
            className="avatar"
            alt={user.displayName}
          />
          <button className="auth-btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="layout">
        <nav className="sidebar">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: <MdDashboard />,
            },
            { id: "expenses", label: "Expenses", icon: <MdCreditCard /> },
            { id: "analytics", label: "Analytics", icon: <MdAnalytics /> },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-item ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <main className="main-content">
          <Page onAddClick={() => setShowAdd(true)} />
        </main>
      </div>

      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
