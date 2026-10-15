const CURRENCY_LOCALES = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" };

function formatMoney(amount, currency = "USD") {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

export default function MobileSavingsGoalCard({ goals }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Savings goals ({goals.length})</p>
      <div className="mt-3 space-y-4">
        {goals.map((goal) => {
          const pct = Number(goal.targetAmount) > 0
            ? Math.min(100, Math.max(0, (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))
            : 0;

          return (
            <div key={goal.id}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-medium text-text">{goal.name}</p>
                <p className="text-[17px] font-semibold text-text">{formatMoney(goal.currentAmount, goal.currency)}</p>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-text-secondary">{pct.toFixed(0)}% of {formatMoney(goal.targetAmount, goal.currency)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
