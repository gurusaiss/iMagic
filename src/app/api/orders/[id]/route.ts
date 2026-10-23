import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ORDER_STATUS_FLOW, OrderStatus } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]">
) {
  const { id } = await ctx.params;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(id);
  return NextResponse.json({ order, items });
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/orders/[id]">
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await ctx.params;
  const body = (await req.json()) as { action: "advance" | "return" | "refund" };

  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | { status: OrderStatus; user_id: number }
    | undefined;
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = order.user_id === user.id;
  const isAdmin = user.role === "admin";

  if ((body.action === "advance" || body.action === "refund") && !isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  if (body.action === "return" && !isOwner && !isAdmin) {
    return NextResponse.json({ error: "Not your order" }, { status: 403 });
  }

  let nextStatus: OrderStatus = order.status;

  if (body.action === "advance") {
    const idx = ORDER_STATUS_FLOW.indexOf(order.status as (typeof ORDER_STATUS_FLOW)[number]);
    if (idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1) {
      nextStatus = ORDER_STATUS_FLOW[idx + 1];
    }
  } else if (body.action === "return") {
    if (order.status === "DELIVERED") nextStatus = "RETURN_REQUESTED";
  } else if (body.action === "refund") {
    if (order.status === "RETURN_REQUESTED") nextStatus = "REFUNDED";
  }

  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(nextStatus, id);

  if (body.action === "return") {
    console.log(`[SIMULATED] Return requested for order #${id}. No real refund processed.`);
  }
  if (body.action === "refund") {
    console.log(`[SIMULATED REFUND] Order #${id} marked as refunded.`);
  }

  return NextResponse.json({ status: nextStatus });
}
