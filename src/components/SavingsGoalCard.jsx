const CURRENCY_LOCALES = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" };

function formatMoney(amount, currency = "USD") {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

function formatDate(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function SavingsGoalCard({ goals }) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="bg-navy text-white px-5 flex items-center min-h-[68px]">
        <span className="text-sm font-semibold tracking-wide">SAVINGS GOALS ({goals.length})</span>
      </div>

      <div className="divide-y divide-border">
        {goals.map((goal) => {
          const pct = Number(goal.targetAmount) > 0
            ? Math.min(100, Math.max(0, (Number(goal.currentAmount) / Number(goal.targetAmount)) * 100))
            : 0;

          return (
            <div key={goal.id} className="px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[17px] font-medium text-text">{goal.name}</p>
                  <p className="text-[14px] text-text-secondary mt-0.5">{goal.category}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[13px] text-text-secondary">Saved so far</p>
                  <p className="text-[28px] font-semibold text-text leading-tight">{formatMoney(goal.currentAmount, goal.currency)}</p>
                  <p className="text-xs text-text-secondary mt-1">of {formatMoney(goal.targetAmount, goal.currency)} goal</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-xs text-text-secondary">
                  <span>{pct.toFixed(0)}% of goal</span>
                  {goal.targetDate && <span>Target {formatDate(goal.targetDate)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-border flex gap-5 text-sm font-medium">
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Add funds
        </span>
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Edit goal
        </span>
      </div>
    </div>
  );
}
