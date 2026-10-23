import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const orders =
    user.role === "admin"
      ? db.prepare("SELECT * FROM orders ORDER BY id DESC").all()
      : db
          .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC")
          .all(user.id);

  return NextResponse.json({ orders });
}

type CheckoutBody = {
  customerName: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  pincode: string;
  items: { phoneId: number; name: string; image: string; price: number; qty: number }[];
};

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in to check out." }, { status: 401 });

  const body = (await req.json()) as CheckoutBody;

  if (!body.items || body.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!body.customerName || !body.addressLine || !body.city || !body.pincode) {
    return NextResponse.json({ error: "Missing address details" }, { status: 400 });
  }

  const total = body.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const insertOrder = db.prepare(`
    INSERT INTO orders (user_id, customer_name, phone_number, address_line, city, pincode, status, payment_status, total)
    VALUES (@userId, @customerName, @phoneNumber, @addressLine, @city, @pincode, 'CONFIRMED', 'PAID', @total)
  `);

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, phone_id, name, image, price, qty)
    VALUES (@orderId, @phoneId, @name, @image, @price, @qty)
  `);

  const orderId = db.transaction(() => {
    const info = insertOrder.run({
      userId: user.id,
      customerName: body.customerName,
      phoneNumber: body.phoneNumber ?? "",
      addressLine: body.addressLine,
      city: body.city,
      pincode: body.pincode,
      total,
    });
    const id = info.lastInsertRowid as number;
    for (const item of body.items) {
      insertItem.run({ orderId: id, ...item });
    }
    return id;
  })();

  // Simulated side effects — replace with real integrations later.
  console.log(`[SIMULATED PAYMENT] Charged ${total} for order #${orderId} — marked PAID.`);
  console.log(`[SIMULATED SMS/EMAIL] Order #${orderId} confirmed, sent to ${body.customerName}.`);

  return NextResponse.json({ orderId });
}
