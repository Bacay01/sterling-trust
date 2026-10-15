"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAddLoanForm({ userId }) {
  const router = useRouter();
  const [type, setType] = useState("Personal");
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termMonths, setTermMonths] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, principal, interestRate, termMonths, monthlyPayment, currency }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create loan");
      } else {
        setPrincipal("");
        setInterestRate("");
        setTermMonths("");
        setMonthlyPayment("");
        router.refresh();
      }
    } catch {
      setError("Could not create loan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-border rounded-lg p-4 mt-3 bg-page">
      <p className="font-medium text-navy text-sm mb-3">Add a new loan</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full">
            <option>Personal</option>
            <option>Auto</option>
            <option>Mortgage</option>
            <option>Student</option>
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
          <label className="block text-xs text-text-secondary mb-1">Principal amount</label>
          <input type="number" step="0.01" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" required />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Interest rate (APR %)</label>
          <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" required />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Term (months)</label>
          <input type="number" value={termMonths} onChange={(e) => setTermMonths(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" required />
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1">Monthly payment</label>
          <input type="number" step="0.01" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} className="border border-border rounded-md px-2 py-1 text-sm w-full" required />
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
      <button type="submit" disabled={saving} className="mt-3 bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary-dark disabled:opacity-50">
        {saving ? "Adding…" : "Add loan"}
      </button>
    </form>
  );
}
