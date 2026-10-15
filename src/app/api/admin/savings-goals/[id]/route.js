import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { currentAmount, targetAmount, status, targetDate } = await req.json();

  const goal = await prisma.savingsGoal.findUnique({ where: { id } });
  if (!goal) return NextResponse.json({ error: "Savings goal not found" }, { status: 404 });

  const data = {};

  if (currentAmount !== undefined) {
    const numeric = Number(currentAmount);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Current amount must be a number" }, { status: 400 });
    }
    data.currentAmount = numeric;
  }

  if (targetAmount !== undefined) {
    const numeric = Number(targetAmount);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Target amount must be a number" }, { status: 400 });
    }
    data.targetAmount = numeric;
  }

  if (status !== undefined) data.status = status;
  if (targetDate !== undefined) data.targetDate = targetDate ? new Date(targetDate) : null;

  const updated = await prisma.savingsGoal.update({ where: { id }, data });
  return NextResponse.json({ goal: updated });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  await prisma.savingsGoal.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
