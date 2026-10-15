const CURRENCY_LOCALES = { USD: "en-US", GBP: "en-GB", EUR: "de-DE" };

function formatMoney(amount, currency = "USD") {
  const locale = CURRENCY_LOCALES[currency] || "en-US";
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));
}

function formatDate(date) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function LoanSummaryCard({ loans }) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="bg-navy text-white px-5 flex items-center min-h-[68px]">
        <span className="text-sm font-semibold tracking-wide">LOANS ({loans.length})</span>
      </div>

      <div className="divide-y divide-border">
        {loans.map((loan) => {
          const paidOff = Number(loan.principal) - Number(loan.balance);
          const pct = Number(loan.principal) > 0 ? Math.min(100, Math.max(0, (paidOff / Number(loan.principal)) * 100)) : 0;

          return (
            <div key={loan.id} className="px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[17px] font-medium text-text">{loan.type} loan</p>
                  <p className="text-[14px] text-text-secondary mt-0.5">#{loan.loanNumber.slice(-8)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[13px] text-text-secondary">Remaining balance</p>
                  <p className="text-[28px] font-semibold text-text leading-tight">{formatMoney(loan.balance, loan.currency)}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatMoney(loan.monthlyPayment, loan.currency)}/mo &middot; {Number(loan.interestRate)}% APR
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between mt-1 text-xs text-text-secondary">
                  <span>{pct.toFixed(0)}% paid off</span>
                  {loan.nextPaymentDate && <span>Next payment {formatDate(loan.nextPaymentDate)}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-border flex gap-5 text-sm font-medium">
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Make a payment
        </span>
        <span className="text-primary/40 cursor-not-allowed" title="Coming soon">
          Statements
        </span>
      </div>
    </div>
  );
}
