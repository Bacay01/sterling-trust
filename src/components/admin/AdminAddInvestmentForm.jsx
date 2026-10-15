"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddInvestmentForm({ userId }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Stocks");
  const [costBasis, setCostBasis] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}/investments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, costBasis, currentValue, currency }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create investment");
      } else {
        setName("");
        setCostBasis("");
        setCurrentValue("");
        router.refresh();
      }
    } catch {
      setError("Could not create investment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 mt-3 bg-page">
      <p className="font-medium text-navy text-sm mb-3">Add a new investment</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-text-secondary mb-1">Investment name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" placeholder="e.g. S&P 500 Index Fund" required />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full">
            <option>Stocks</option>
            <option>ETFs</option>
            <option>Mutual Funds</option>
            <option>Bonds</option>
            <option>Crypto</option>
            <option>Retirement</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full">
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Cost basis (amount invested)</label>
          <input type="number" step="0.01" value={costBasis} onChange={(e) => setCostBasis(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" required />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Current value</label>
          <input type="number" step="0.01" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" placeholder="defaults to cost basis" />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <button type="submit" disabled={saving} className="mt-3 bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50">
        {saving ? "Adding…" : "Add investment"}
      </button>
    </form>
  );
}
