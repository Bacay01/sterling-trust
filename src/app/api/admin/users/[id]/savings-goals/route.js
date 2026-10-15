import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { SUPPORTED_CURRENCIES } from "@/lib/exchangeRate";

export async function POST(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { name, category, targetAmount, currentAmount, currency, targetDate } = await req.json();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Goal name is required" }, { status: 400 });
  }

  const targetNum = Number(targetAmount);
  const currentNum = currentAmount === undefined || currentAmount === "" ? 0 : Number(currentAmount);

  if ([targetNum, currentNum].some((n) => Number.isNaN(n))) {
    return NextResponse.json({ error: "Amounts must be numbers" }, { status: 400 });
  }

  const goalCurrency = currency || "USD";
  if (!SUPPORTED_CURRENCIES.includes(goalCurrency)) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }

  const goal = await prisma.savingsGoal.create({
    data: {
      userId: id,
      name: name.trim(),
      category: category || "General",
      targetAmount: targetNum,
      currentAmount: currentNum,
      currency: goalCurrency,
      targetDate: targetDate ? new Date(targetDate) : null,
    },
  });

  return NextResponse.json({ goal });
}
