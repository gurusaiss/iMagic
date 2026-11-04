import Link from "next/link";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Phone, Order, StaffMember } from "@/lib/types";
import { formatINR } from "@/lib/format";
import AdminPhonesTable from "@/components/AdminPhonesTable";
import AdminOrdersTable from "@/components/AdminOrdersTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await requireAdmin();
  const phones = db.prepare("SELECT * FROM phones ORDER BY id DESC").all() as Phone[];
  const orders = db
    .prepare(`
      SELECT o.*, s.name as staff_name
      FROM orders o
      LEFT JOIN staff_members s ON s.id = o.assigned_staff_id
      ORDER BY o.id DESC
    `)
    .all() as Order[];
  const staff = db.prepare("SELECT * FROM staff_members ORDER BY name").all() as StaffMember[];

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status !== "DELIVERED" && o.status !== "REFUNDED").length;
  const lowStock = phones.filter((p) => p.stock <= 5).length;

  const stats = [
    { label: "Total Phones", value: phones.length, accent: "text-blue-600", icon: "📱" },
    { label: "Total Orders", value: orders.length, accent: "text-purple-600", icon: "🛒" },
    { label: "Pending Orders", value: pending, accent: "text-amber-600", icon: "⏳" },
    { label: "Low Stock Items", value: lowStock, accent: "text-red-600", icon: "⚠️" },
    { label: "Total Revenue", value: formatINR(revenue), accent: "text-green-600", icon: "💰" },
    { label: "Delivery Staff", value: staff.filter((s) => s.active).length, accent: "text-indigo-600", icon: "🚚" },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Logged in as <span className="font-medium text-gray-700">{admin.name}</span> ({admin.email})
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/staff" className="btn-secondary !px-4 !py-2 text-sm">
            👥 Manage Staff
          </Link>
          <Link href="/admin/phones/new" className="btn-primary !px-5 !py-2 text-sm">
            + Add Phone
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fade-in-up rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xl">{s.icon}</p>
            <p className="mt-1 text-xs font-medium text-gray-500">{s.label}</p>
            <p className={`mt-1 text-xl font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Phones */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Phones ({phones.length})</h2>
          <Link href="/admin/phones/new" className="btn-primary !px-5 !py-2 text-sm">
            + Add Phone
          </Link>
        </div>
        <AdminPhonesTable phones={phones} />
      </section>

      {/* Orders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Orders ({orders.length})</h2>
          <Link href="/admin/staff" className="text-sm text-blue-600 hover:underline">
            Manage delivery staff →
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="rounded-xl border bg-white py-16 text-center text-gray-500">
            <p className="text-4xl">📭</p>
            <p className="mt-2">No orders placed yet.</p>
          </div>
        ) : (
          <AdminOrdersTable orders={orders} staff={staff} />
        )}
      </section>
    </div>
  );
}
