"use client";
import { useState } from "react";

const CURRENCY_LOCALES = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" };

function formatMoney(amount, currency = "USD") {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

export default function AdminInvestmentRow({ investment }) {
  const [currentValue, setCurrentValue] = useState(investment.currentValue.toString());
  const [status, setStatus] = useState(investment.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/investments/${investment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentValue, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not update investment");
      } else {
        setMessage("Investment updated");
      }
    } catch {
      setError("Could not update investment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-navy">{investment.name}</p>
          <p className="text-xs text-text-secondary">{investment.category}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-primary-light text-navy font-medium capitalize">
          {investment.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-3 text-sm text-text-secondary space-y-1">
        <p>Cost basis: {formatMoney(investment.costBasis, investment.currency)}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Current value</label>
          <input
            type="number"
            step="0.01"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
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
            <option value="sold">Sold</option>
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
