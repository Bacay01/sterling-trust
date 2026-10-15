const CURRENCY_LOCALES = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" };

function formatMoney(amount, currency = "USD") {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

export default function MobileInvestmentCard({ investments }) {
  const totalValue = investments.reduce((sum, inv) => sum + Number(inv.currentValue), 0);
  const totalCost = investments.reduce((sum, inv) => sum + Number(inv.costBasis), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const currency = investments[0]?.currency || "USD";

  return (
    <div className="bg-surface rounded-2xl border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Investments ({investments.length})</p>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-[20px] font-semibold text-text">{formatMoney(totalValue, currency)}</p>
        <p className={`text-xs ${totalGain >= 0 ? "text-success" : "text-danger"}`}>
          {totalGain >= 0 ? "+" : ""}{totalGainPct.toFixed(1)}%
        </p>
      </div>
      <div className="mt-3 space-y-3">
        {investments.map((inv) => {
          const gain = Number(inv.currentValue) - Number(inv.costBasis);
          return (
            <div key={inv.id} className="flex items-center justify-between">
              <p className="text-[15px] font-medium text-text">{inv.name}</p>
              <div className="text-right">
                <p className="text-[15px] font-semibold text-text">{formatMoney(inv.currentValue, inv.currency)}</p>
                <p className={`text-xs ${gain >= 0 ? "text-success" : "text-danger"}`}>{gain >= 0 ? "+" : ""}{formatMoney(gain, inv.currency)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
