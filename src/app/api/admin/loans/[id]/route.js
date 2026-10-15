import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { balance, interestRate, monthlyPayment, status, nextPaymentDate } = await req.json();

  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });

  const data = {};

  if (balance !== undefined) {
    const numeric = Number(balance);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Balance must be a number" }, { status: 400 });
    }
    data.balance = numeric;
  }

  if (interestRate !== undefined) {
    const numeric = Number(interestRate);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Interest rate must be a number" }, { status: 400 });
    }
    data.interestRate = numeric;
  }

  if (monthlyPayment !== undefined) {
    const numeric = Number(monthlyPayment);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Monthly payment must be a number" }, { status: 400 });
    }
    data.monthlyPayment = numeric;
  }

  if (status !== undefined) data.status = status;
  if (nextPaymentDate !== undefined) data.nextPaymentDate = new Date(nextPaymentDate);

  const updated = await prisma.loan.update({ where: { id }, data });
  return NextResponse.json({ loan: updated });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  await prisma.loan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
