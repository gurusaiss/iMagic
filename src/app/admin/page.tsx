import Link from "next/link";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Phone, Order } from "@/lib/types";
import { formatINR } from "@/lib/format";
import AdminPhonesTable from "@/components/AdminPhonesTable";
import AdminOrdersTable from "@/components/AdminOrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const phones = db.prepare("SELECT * FROM phones ORDER BY id DESC").all() as Phone[];
  const orders = db.prepare("SELECT * FROM orders ORDER BY id DESC").all() as Order[];

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "REFUNDED").length;

  const stats = [
    { label: "Total Phones", value: phones.length, accent: "text-blue-600" },
    { label: "Total Orders", value: orders.length, accent: "text-purple-600" },
    { label: "Pending Orders", value: pending, accent: "text-amber-600" },
    { label: "Total Revenue", value: formatINR(revenue), accent: "text-green-600" },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        Logged in as {admin.name} ({admin.email}) — shared admin view for demo purposes, no
        multi-role permissions yet.
      </p>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${i * 70}ms` }}
            className="animate-fade-in-up rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Phones ({phones.length})</h2>
          <Link href="/admin/phones/new" className="btn-primary !px-5 !py-2 text-sm">
            + Add Phone
          </Link>
        </div>
        <AdminPhonesTable phones={phones} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders placed yet.</p>
        ) : (
          <AdminOrdersTable orders={orders} />
        )}
      </section>
    </div>
  );
}
