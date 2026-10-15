const CURRENCY_LOCALES = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" };

function formatMoney(amount, currency = "USD") {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

export default function InvestmentSummaryCard({ investments }) {
  const totalValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0);
  const totalCost = investments.reduce((sum, inv) => sum + Number(inv.costBasis), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const currency = investments[0]?.currency || "USD";

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="bg-navy text-white px-5 flex items-center justify-between min-h-[68px]">
        <span className="text-sm font-semibold tracking-wide">INVESTMENTS ({investments.length})</span>
        <div className="text-right">
          <p className="text-[20px] font-semibold leading-tight">{formatMoney(totalValue, currency)}</p>
          <p className={`text-xs ${totalGain >= 0 ? "text-success" : "text-danger"}`}>
            {totalGain >= 0 ? "+" : ""}{formatMoney(totalGain, currency)} ({totalGainPct.toFixed(1)}%)
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {investments.map((inv) => {
          const gain = Number(inv.currentValue) - Number(inv.costBasis);
          const gainPct = Number(inv.costBasis) > 0 ? (gain / Number(inv.costBasis)) * 100 : 0;

          return (
            <div key={inv.id} className="px-5 py-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[17px] font-medium text-text">{inv.name}</p>
                <p className="text-[14px] text-text-secondary mt-0.5">{inv.category}</p>
              </div>
              <div className="text-right">
                <p className="text-[17px] font-semibold text-text">{formatMoney(inv.currentValue, inv.currency)}</p>
                <p className={`text-xs mt-0.5 ${gain >= 0 ? "text-success" : "text-danger"}`}>
                  {gain >= 0 ? "+" : ""}{formatMoney(gain, inv.currency)} ({gainPct.toFixed(1)}%)
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-border flex gap-5 text-sm font-medium">
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Buy / sell
        </span>
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Statements
        </span>
      </div>
    </div>
  );
}
