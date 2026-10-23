import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { Order, OrderItem, STATUS_LABELS } from "@/lib/types";
import { formatINR } from "@/lib/format";
import Timeline from "@/components/Timeline";
import ReturnButton from "@/components/ReturnButton";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as
    | Order
    | undefined;

  if (!order) notFound();
  if (order.user_id !== user.id && user.role !== "admin") redirect("/orders");

  const items = db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(id) as OrderItem[];

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-8">
      <Link href="/orders" className="text-sm text-blue-600 transition-colors hover:underline">
        ← Back to My Orders
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
          {STATUS_LABELS[order.status]}
        </span>
      </div>
      <p className="text-sm text-gray-500">
        Placed on {new Date(order.created_at + "Z").toLocaleString()}
      </p>

      <div className="animate-fade-in-up mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <Timeline status={order.status} />
      </div>

      <div className="animate-fade-in-up mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Items</h2>
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.image} alt={i.name} className="h-12 w-12 object-contain" />
              <div className="flex-1 text-sm">
                <p className="font-medium">{i.name}</p>
                <p className="text-gray-500">Qty {i.qty}</p>
              </div>
              <span className="text-sm font-semibold">{formatINR(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t pt-2 font-semibold">
          <span>Total Paid</span>
          <span>{formatINR(order.total)}</span>
        </div>
      </div>

      <div className="animate-fade-in-up mt-6 rounded-xl border bg-white p-5 text-sm text-gray-600 shadow-sm">
        <h2 className="mb-2 font-semibold text-gray-900">Delivery Address</h2>
        <p>{order.customer_name}</p>
        <p>{order.address_line}</p>
        <p>
          {order.city} - {order.pincode}
        </p>
        {order.phone_number && <p>Phone: {order.phone_number}</p>}
      </div>

      {order.status === "DELIVERED" && order.user_id === user.id && (
        <div className="animate-fade-in-up mt-6">
          <ReturnButton orderId={order.id} />
        </div>
      )}
    </div>
  );
}
