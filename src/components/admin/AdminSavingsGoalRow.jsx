"use client";
import { useState } from "react";

const CURRENCY_LOCALES = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" };

function formatMoney(amount, currency = "USD") {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

function formatDate(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function AdminSavingsGoalRow({ goal }) {
  const [currentAmount, setCurrentAmount] = useState(goal.currentAmount.toString());
  const [status, setStatus] = useState(goal.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/savings-goals/${goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentAmount, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not update goal");
      } else {
        setMessage("Goal updated");
      }
    } catch {
      setError("Could not update goal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-navy">{goal.name}</p>
          <p className="text-xs text-text-secondary">{goal.category}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-primary-light text-navy font-medium capitalize">
          {goal.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-3 text-sm text-text-secondary space-y-1">
        <p>Target: {formatMoney(goal.targetAmount, goal.currency)}</p>
        {goal.targetDate && <p>By: {formatDate(goal.targetDate)}</p>}
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Current saved</label>
          <input
            type="number"
            step="0.01"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="border border-border rounded-md px-2 py-1 text-sm w-32"
          />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-border rounded-md px-2 py-1 text-sm"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm text-primary font-medium hover:underline disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      {message && <p className="mt-2 text-xs text-success">{message}</p>}
    </div>
  );
}
