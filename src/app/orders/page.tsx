import Link from "next/link";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { STATUS_LABELS } from "@/lib/types";
import type { Order } from "@/lib/types";
import EmptyState from "@/components/EmptyState";

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const orders = (
    user.role === "admin"
      ? db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all()
      : db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(user.id)
  ) as Order[];

  if (orders.length === 0) {
    return <EmptyState title="No orders yet." action="Start shopping" actionHref="/phones" />;
  }

  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Your orders</h1>
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/orders/${o.id}`} className="card flex items-center justify-between p-5">
              <div>
                <p className="font-medium">Order #{o.id}</p>
                <p className="text-sm text-muted">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">₹{o.total.toLocaleString("en-IN")}</span>
                <span className={`pill ${o.status === "CANCELLED" ? "bg-red-50 text-[var(--danger)]" : "bg-[#f5f5f7]"}`}>
                  {STATUS_LABELS[o.status] ?? o.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
