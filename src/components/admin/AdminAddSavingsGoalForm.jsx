"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddSavingsGoalForm({ userId }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("General");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}/savings-goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, targetAmount, currentAmount, currency, targetDate }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create goal");
      } else {
        setName("");
        setTargetAmount("");
        setCurrentAmount("");
        setTargetDate("");
        router.refresh();
      }
    } catch {
      setError("Could not create goal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 mt-3 bg-page">
      <p className="font-medium text-navy text-sm mb-3">Add a new savings goal</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-text-secondary mb-1">Goal name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" required />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full">
            <option>General</option>
            <option>Emergency fund</option>
            <option>Vacation</option>
            <option>Home</option>
            <option>Car</option>
            <option>Wedding</option>
            <option>Education</option>
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
          <label className="block text-xs text-text-secondary mb-1">Target amount</label>
          <input type="number" step="0.01" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" required />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Starting saved amount</label>
          <input type="number" step="0.01" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" placeholder="0.00" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-text-secondary mb-1">Target date (optional)</label>
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <button type="submit" disabled={saving} className="mt-3 bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50">
        {saving ? "Adding…" : "Add goal"}
      </button>
    </form>
  );
}
