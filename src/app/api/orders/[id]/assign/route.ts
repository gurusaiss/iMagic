import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]/assign">
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const { staffId } = (await req.json()) as { staffId: number | null };

  const order = db.prepare("SELECT id FROM orders WHERE id = ?").get(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  db.prepare("UPDATE orders SET assigned_staff_id = ? WHERE id = ?").run(
    staffId ?? null,
    id
  );

  return NextResponse.json({ ok: true });
}
