import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  const { currentValue, status } = await req.json();

  const investment = await prisma.investment.findUnique({ where: { id } });
  if (!investment) return NextResponse.json({ error: "Investment not found" }, { status: 404 });

  const data = {};

  if (currentValue !== undefined) {
    const numeric = Number(currentValue);
    if (Number.isNaN(numeric)) {
      return NextResponse.json({ error: "Current value must be a number" }, { status: 400 });
    }
    data.currentValue = numeric;
  }

  if (status !== undefined) data.status = status;

  const updated = await prisma.investment.update({ where: { id }, data });
  return NextResponse.json({ investment: updated });
}

export async function DELETE(req, { params }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { id } = await params;
  await prisma.investment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
