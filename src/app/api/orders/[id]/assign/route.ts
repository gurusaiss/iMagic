import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const staffId = body.staffId ? Number(body.staffId) : null;

  const info = db.prepare("UPDATE orders SET assigned_staff_id = ? WHERE id = ?").run(staffId, id);
  if (info.changes === 0) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
