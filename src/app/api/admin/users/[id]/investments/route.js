import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { SUPPORTED_CURRENCIES } from "@/lib/exchangeRate";

export async function POST(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { name, category, costBasis, currentValue, currency } = await req.json();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Investment name is required" }, { status: 400 });
  }

  const costNum = Number(costBasis);
  const valueNum = currentValue === undefined || currentValue === "" ? costNum : Number(currentValue);

  if ([costNum, valueNum].some((n) => Number.isNaN(n))) {
    return NextResponse.json({ error: "Amounts must be numbers" }, { status: 400 });
  }

  const investmentCurrency = currency || "USD";
  if (!SUPPORTED_CURRENCIES.includes(investmentCurrency)) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }

  const investment = await prisma.investment.create({
    data: {
      userId: id,
      name: name.trim(),
      category: category || "Stocks",
      costBasis: costNum,
      currentValue: valueNum,
      currency: investmentCurrency,
    },
  });

  return NextResponse.json({ investment });
}
