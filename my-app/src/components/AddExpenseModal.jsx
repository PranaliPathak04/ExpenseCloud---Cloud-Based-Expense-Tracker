import { useState } from "react";
import { useExpenses } from "../hooks/useExpenses";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Bills",
  "Other",
];

export default function AddExpenseModal({ onClose }) {
  const { addExpense } = useExpenses();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount)
      return setError("Please fill in all required fields.");
    setSaving(true);
    try {
      await addExpense({ ...form, receiptFile });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add expense</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <input
              className="form-input"
              placeholder="e.g. Lunch at cafe"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Receipt photo (optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="file-input"
              onChange={(e) => setReceiptFile(e.target.files[0])}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "Save expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
