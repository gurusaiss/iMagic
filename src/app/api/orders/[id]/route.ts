import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ORDER_STATUS_FLOW } from "@/lib/types";

type OrderRow = {
  id: number;
  user_id: number;
  status: string;
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const order = db
    .prepare(
      `SELECT orders.*, staff_members.name as staff_name FROM orders
       LEFT JOIN staff_members ON staff_members.id = orders.assigned_staff_id
       WHERE orders.id = ?`
    )
    .get(id) as (OrderRow & Record<string, unknown>) | undefined;

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (user.role !== "admin" && order.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(id);
  return NextResponse.json({ order, items });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as OrderRow | undefined;
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const body = await req.json();
  const action = body.action as "advance" | "return" | "refund" | "cancel";

  if (action === "advance") {
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const idx = ORDER_STATUS_FLOW.indexOf(order.status as (typeof ORDER_STATUS_FLOW)[number]);
    if (idx === -1 || idx >= ORDER_STATUS_FLOW.length - 1) {
      return NextResponse.json({ error: "Order cannot be advanced further" }, { status: 400 });
    }
    const nextStatus = ORDER_STATUS_FLOW[idx + 1];
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(nextStatus, id);
    return NextResponse.json({ ok: true, status: nextStatus });
  }

  if (action === "return") {
    if (user.role !== "admin" && order.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (order.status !== "DELIVERED") {
      return NextResponse.json({ error: "Only delivered orders can be returned" }, { status: 400 });
    }
    db.prepare("UPDATE orders SET status = 'RETURN_REQUESTED' WHERE id = ?").run(id);
    return NextResponse.json({ ok: true, status: "RETURN_REQUESTED" });
  }

  if (action === "refund") {
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (order.status !== "RETURN_REQUESTED") {
      return NextResponse.json({ error: "Only requested returns can be refunded" }, { status: 400 });
    }
    db.prepare("UPDATE orders SET status = 'REFUNDED' WHERE id = ?").run(id);
    return NextResponse.json({ ok: true, status: "REFUNDED" });
  }

  if (action === "cancel") {
    if (user.role !== "admin" && order.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (order.status !== "CONFIRMED" && order.status !== "PACKED") {
      return NextResponse.json({ error: "Order can no longer be cancelled" }, { status: 400 });
    }
    db.prepare("UPDATE orders SET status = 'CANCELLED' WHERE id = ?").run(id);
    return NextResponse.json({ ok: true, status: "CANCELLED" });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
