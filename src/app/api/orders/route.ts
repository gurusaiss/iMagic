import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { Order } from "@/lib/types";

type CheckoutBody = {
  customerName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  pincode: string;
  paymentMethod?: string;
  idempotencyKey?: string;
  items: { id: number; qty: number }[];
};

const PINCODE_RE = /^\d{6}$/;
const PHONE_RE = /^\d{10}$/;

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const orders =
    user.role === "admin"
      ? db
          .prepare(
            `SELECT orders.*, staff_members.name as staff_name FROM orders
             LEFT JOIN staff_members ON staff_members.id = orders.assigned_staff_id
             ORDER BY orders.created_at DESC`
          )
          .all()
      : db
          .prepare(
            `SELECT orders.*, staff_members.name as staff_name FROM orders
             LEFT JOIN staff_members ON staff_members.id = orders.assigned_staff_id
             WHERE orders.user_id = ? ORDER BY orders.created_at DESC`
          )
          .all(user.id);

  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body: CheckoutBody = await req.json();

  if (!body.customerName?.trim() || !body.addressLine?.trim() || !body.city?.trim()) {
    return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
  }
  if (!PINCODE_RE.test(body.pincode ?? "")) {
    return NextResponse.json({ error: "Pincode must be 6 digits" }, { status: 400 });
  }
  if (body.phoneNumber && !PHONE_RE.test(body.phoneNumber)) {
    return NextResponse.json({ error: "Phone number must be 10 digits" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  if (body.idempotencyKey) {
    const existing = db
      .prepare("SELECT id FROM orders WHERE idempotency_key = ?")
      .get(body.idempotencyKey) as { id: number } | undefined;
    if (existing) return NextResponse.json({ order: { id: existing.id } });
  }

  const phoneIds = body.items.map((i) => i.id);
  const placeholders = phoneIds.map(() => "?").join(",");
  const phones = db
    .prepare(`SELECT * FROM phones WHERE id IN (${placeholders})`)
    .all(...phoneIds) as { id: number; brand: string; model: string; price: number; image: string; stock: number }[];

  const phoneMap = new Map(phones.map((p) => [p.id, p]));
  let total = 0;
  for (const item of body.items) {
    const phone = phoneMap.get(item.id);
    if (!phone || item.qty < 1 || item.qty > phone.stock) {
      return NextResponse.json({ error: "One or more items are unavailable" }, { status: 400 });
    }
    total += phone.price * item.qty;
  }

  const createOrder = db.transaction(() => {
    const info = db
      .prepare(
        `INSERT INTO orders (user_id, customer_name, phone_number, address_line, city, pincode, payment_method, total, idempotency_key)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        user.id,
        body.customerName.trim(),
        body.phoneNumber?.trim() ?? "",
        body.addressLine.trim(),
        body.city.trim(),
        body.pincode,
        body.paymentMethod ?? "upi",
        total,
        body.idempotencyKey ?? null
      );
    const orderId = Number(info.lastInsertRowid);

    const insertItem = db.prepare(
      "INSERT INTO order_items (order_id, phone_id, name, image, price, qty) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const decrementStock = db.prepare("UPDATE phones SET stock = stock - ? WHERE id = ?");

    for (const item of body.items) {
      const phone = phoneMap.get(item.id)!;
      insertItem.run(orderId, phone.id, `${phone.brand} ${phone.model}`, phone.image, phone.price, item.qty);
      decrementStock.run(item.qty, phone.id);
    }
    return orderId;
  });

  try {
    const orderId = createOrder();
    return NextResponse.json({ order: { id: orderId } });
  } catch {
    if (body.idempotencyKey) {
      const existing = db
        .prepare("SELECT id FROM orders WHERE idempotency_key = ?")
        .get(body.idempotencyKey) as { id: number } | undefined;
      if (existing) return NextResponse.json({ order: { id: existing.id } });
    }
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

export type { Order };
