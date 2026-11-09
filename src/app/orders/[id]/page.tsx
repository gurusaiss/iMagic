import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import type { Order, OrderItem } from "@/lib/types";
import Timeline from "@/components/Timeline";
import CancelOrderButton from "@/components/CancelOrderButton";
import ReturnButton from "@/components/ReturnButton";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined;
  if (!order) notFound();
  if (user.role !== "admin" && order.user_id !== user.id) notFound();

  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(id) as OrderItem[];

  return (
    <div className="section">
      <div className="container-narrow max-w-2xl">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Order #{order.id}</h1>
        <p className="mb-8 text-sm text-muted">Placed on {new Date(order.created_at).toLocaleDateString()}</p>

        <div className="card mb-8 p-6">
          <Timeline status={order.status} />
        </div>

        <div className="card mb-8 flex flex-col divide-y divide-[var(--border)] p-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <span>{item.name} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 font-semibold">
            <span>Total</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="card mb-8 p-6 text-sm">
          <h2 className="mb-3 font-semibold">Shipping address</h2>
          <p>{order.customer_name}</p>
          <p className="text-muted">{order.address_line}, {order.city} - {order.pincode}</p>
        </div>

        <div className="flex gap-3">
          {(order.status === "CONFIRMED" || order.status === "PACKED") && <CancelOrderButton orderId={order.id} />}
          {order.status === "DELIVERED" && <ReturnButton orderId={order.id} />}
        </div>
      </div>
    </div>
  );
}
