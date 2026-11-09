"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { STATUS_LABELS } from "@/lib/types";
import type { Order, StaffMember } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-[#f5f5f7] text-[var(--foreground)]",
  PACKED: "bg-[#e5f0ff] text-[#0071e3]",
  OUT_FOR_DELIVERY: "bg-[#fff4e5] text-[#b45309]",
  DELIVERED: "bg-[#e6f6ea] text-[var(--success)]",
  RETURN_REQUESTED: "bg-[#fff4e5] text-[#b45309]",
  REFUNDED: "bg-[#f0f0f0] text-muted",
  CANCELLED: "bg-red-50 text-[var(--danger)]",
};

export default function AdminOrdersTable({ orders, staff }: { orders: Order[]; staff: StaffMember[] }) {
  const router = useRouter();

  async function advance(id: number) {
    const res = await apiFetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance" }),
    });
    if (res.ok) router.refresh();
  }

  async function refund(id: number) {
    const res = await apiFetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "refund" }),
    });
    if (res.ok) router.refresh();
  }

  async function assign(id: number, staffId: string) {
    const res = await apiFetch(`/api/orders/${id}/assign`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: staffId || null }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left text-muted">
            <th className="p-4">Order</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
            <th className="p-4">Staff</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-[var(--border)] last:border-0">
              <td className="p-4">#{o.id}</td>
              <td className="p-4">{o.customer_name}</td>
              <td className="p-4">₹{o.total.toLocaleString("en-IN")}</td>
              <td className="p-4">
                <span className={`pill ${STATUS_COLORS[o.status] ?? ""}`}>{STATUS_LABELS[o.status] ?? o.status}</span>
              </td>
              <td className="p-4">
                <select
                  defaultValue={o.assigned_staff_id ?? ""}
                  onChange={(e) => assign(o.id, e.target.value)}
                  className="rounded-lg border border-[var(--border)] px-2 py-1 text-xs"
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="flex gap-2 p-4">
                {["CONFIRMED", "PACKED", "OUT_FOR_DELIVERY"].includes(o.status) && (
                  <button onClick={() => advance(o.id)} className="text-[var(--accent)]">
                    Advance
                  </button>
                )}
                {o.status === "RETURN_REQUESTED" && (
                  <button onClick={() => refund(o.id)} className="text-[var(--danger)]">
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
