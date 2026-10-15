import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminUserEditForm from "@/components/admin/AdminUserEditForm";
import AdminAccountRow from "@/components/admin/AdminAccountRow";
import AdminCreditCardRow from "@/components/admin/AdminCreditCardRow";
import AdminLoanRow from "@/components/admin/AdminLoanRow";
import AdminAddLoanForm from "@/components/admin/AdminAddLoanForm";
import AdminSavingsGoalRow from "@/components/admin/AdminSavingsGoalRow";
import AdminAddSavingsGoalForm from "@/components/admin/AdminAddSavingsGoalForm";
import AdminInvestmentRow from "@/components/admin/AdminInvestmentRow";
import AdminAddInvestmentForm from "@/components/admin/AdminAddInvestmentForm";

export default async function AdminUserDetailPage({ params }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: {
        include: {
          sentTx: { orderBy: { createdAt: "desc" } },
          receivedTx: { orderBy: { createdAt: "desc" } },
        },
      },
      creditCards: true,
      loans: { orderBy: { createdAt: "desc" } },
      savingsGoals: { orderBy: { createdAt: "desc" } },
      investments: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) notFound();

  const plainUser = { id: user.id, name: user.name, email: user.email };

  const accounts = user.accounts.map((acc) => {
    const transactions = [
  ...acc.sentTx.map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    description: t.description,
    externalLabel: t.externalLabel,
    direction: "debit",
    createdAt: t.createdAt,
  })),
  ...acc.receivedTx.map((t) => ({
    id: t.id,
    amount: Number(t.amount),
    description: t.description,
    externalLabel: t.externalLabel,
    direction: "credit",
    createdAt: t.createdAt,
  })),
].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return {
      id: acc.id,
      accountNumber: acc.accountNumber,
      type: acc.type,
      balance: Number(acc.balance),
      currency: acc.currency,
      frozen: acc.frozen,
      frozenReason: acc.frozenReason,
      transactions,
    };
  });

  const creditCards = user.creditCards.map((card) => ({
    id: card.id,
    cardNumber: card.cardNumber,
    balance: Number(card.balance),
    creditLimit: Number(card.creditLimit),
    currency: card.currency,
  }));

  const loans = user.loans.map((loan) => ({
    id: loan.id,
    loanNumber: loan.loanNumber,
    type: loan.type,
    principal: Number(loan.principal),
    balance: Number(loan.balance),
    interestRate: Number(loan.interestRate),
    termMonths: loan.termMonths,
    monthlyPayment: Number(loan.monthlyPayment),
    currency: loan.currency,
    status: loan.status,
  }));

  const savingsGoals = user.savingsGoals.map((goal) => ({
    id: goal.id,
    name: goal.name,
    category: goal.category,
    targetAmount: Number(goal.targetAmount),
    currentAmount: Number(goal.currentAmount),
    currency: goal.currency,
    targetDate: goal.targetDate,
    status: goal.status,
  }));

  const investments = user.investments.map((inv) => ({
    id: inv.id,
    name: inv.name,
    category: inv.category,
    costBasis: Number(inv.costBasis),
    currentValue: Number(inv.currentValue),
    currency: inv.currency,
    status: inv.status,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">{user.name}</h1>
      <p className="text-sm text-text-secondary mt-1">{user.email}</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminUserEditForm user={plainUser} />

        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-navy">Accounts</h2>
          <div className="mt-4 space-y-3">
            {accounts.map((acc) => (
              <AdminAccountRow key={acc.id} account={acc} />
            ))}
            {accounts.length === 0 && <p className="text-sm text-text-secondary">No accounts.</p>}
          </div>

          {creditCards.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="text-lg font-semibold text-navy">Credit cards</h2>
              {creditCards.map((card) => (
                <AdminCreditCardRow key={card.id} card={card} />
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="text-lg font-semibold text-navy">Loans</h2>
            <div className="mt-4">
              {loans.map((loan) => (
                <AdminLoanRow key={loan.id} loan={loan} />
              ))}
              {loans.length === 0 && <p className="text-sm text-text-secondary">No loans.</p>}
            </div>
            <AdminAddLoanForm userId={user.id} />
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="text-lg font-semibold text-navy">Savings goals</h2>
            <div className="mt-4">
              {savingsGoals.map((goal) => (
                <AdminSavingsGoalRow key={goal.id} goal={goal} />
              ))}
              {savingsGoals.length === 0 && <p className="text-sm text-text-secondary">No savings goals.</p>}
            </div>
            <AdminAddSavingsGoalForm userId={user.id} />
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h2 className="text-lg font-semibold text-navy">Investments</h2>
            <div className="mt-4">
              {investments.map((inv) => (
                <AdminInvestmentRow key={inv.id} investment={inv} />
              ))}
              {investments.length === 0 && <p className="text-sm text-text-secondary">No investments.</p>}
            </div>
            <AdminAddInvestmentForm userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
