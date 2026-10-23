import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { Order, OrderItem } from "@/lib/types";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | Order
    | undefined;

  if (!order) notFound();

  const items = db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(id) as OrderItem[];

  return (
    <div className="animate-fade-in mx-auto max-w-2xl px-4 py-12 text-center">
      <div
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600"
        style={{ animation: "pulse-once 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      >
        ✓
      </div>
      <h1 className="animate-fade-in-up text-2xl font-bold">Order Confirmed!</h1>
      <p className="animate-fade-in-up mt-2 text-gray-600">
        Thanks, {order.customer_name}. Your order{" "}
        <span className="font-semibold">#{order.id}</span> has been placed and paid
        (simulated).
      </p>

      <div className="animate-fade-in-up mt-8 rounded-xl border bg-white p-5 text-left shadow-sm">
        <h2 className="mb-3 font-semibold">Items</h2>
        <ul className="space-y-2 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span>
                {i.name} × {i.qty}
              </span>
              <span>{formatINR(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t pt-2 font-semibold">
          <span>Total Paid</span>
          <span>{formatINR(order.total)}</span>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Delivering to: {order.address_line}, {order.city} - {order.pincode}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link href={`/orders/${order.id}`} className="btn-primary">
          Track Order
        </Link>
        <Link href="/phones" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
