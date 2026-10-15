import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { SUPPORTED_CURRENCIES } from "@/lib/exchangeRate";

export async function POST(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { type, principal, interestRate, termMonths, monthlyPayment, currency } = await req.json();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const principalNum = Number(principal);
  const rateNum = Number(interestRate);
  const termNum = Number(termMonths);
  const paymentNum = Number(monthlyPayment);

  if ([principalNum, rateNum, termNum, paymentNum].some((n) => Number.isNaN(n))) {
    return NextResponse.json({ error: "All loan amounts must be numbers" }, { status: 400 });
  }

  const loanCurrency = currency || "USD";
  if (!SUPPORTED_CURRENCIES.includes(loanCurrency)) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }

  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  const loan = await prisma.loan.create({
    data: {
      userId: id,
      type: type || "Personal",
      principal: principalNum,
      balance: principalNum,
      interestRate: rateNum,
      termMonths: termNum,
      monthlyPayment: paymentNum,
      currency: loanCurrency,
      nextPaymentDate,
    },
  });

  return NextResponse.json({ loan });
}
