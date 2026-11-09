import Link from "next/link";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { Phone, Order, StaffMember } from "@/lib/types";
import AdminPhonesTable from "@/components/AdminPhonesTable";
import AdminOrdersTable from "@/components/AdminOrdersTable";

export default async function AdminPage() {
  await requireAdmin();

  const phones = db.prepare("SELECT * FROM phones ORDER BY id DESC").all() as Phone[];
  const orders = db
    .prepare(
      `SELECT orders.*, staff_members.name as staff_name FROM orders
       LEFT JOIN staff_members ON staff_members.id = orders.assigned_staff_id
       ORDER BY orders.created_at DESC`
    )
    .all() as Order[];
  const staff = db.prepare("SELECT * FROM staff_members ORDER BY name").all() as StaffMember[];

  return (
    <div className="section">
      <div className="container-narrow">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Admin dashboard</h1>
          <div className="flex gap-3">
            <Link href="/admin/staff" className="btn-secondary">
              Manage staff
            </Link>
            <Link href="/admin/phones/new" className="btn-primary">
              Add phone
            </Link>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-semibold">Orders</h2>
        <div className="mb-12">
          <AdminOrdersTable orders={orders} staff={staff} />
        </div>

        <h2 className="mb-4 text-xl font-semibold">Phones</h2>
        <AdminPhonesTable phones={phones} />
      </div>
    </div>
  );
}
