"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Order, StaffMember, ORDER_STATUS_FLOW, STATUS_LABELS } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  RETURN_REQUESTED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-gray-200 text-gray-600",
};

export default function AdminOrdersTable({ orders, staff }: { orders: Order[]; staff: StaffMember[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [assignBusy, setAssignBusy] = useState<number | null>(null);
  const [localAssign, setLocalAssign] = useState<Record<number, number | "">>({});

  async function act(id: number, action: "advance" | "refund") {
    setBusyId(id);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusyId(null);
    if (res.ok) {
      showToast(
        action === "advance" ? `Order #${id} moved to next stage` : `Order #${id} marked refunded`,
        "success"
      );
      router.refresh();
    } else {
      showToast("Action failed", "error");
    }
  }

  async function handleAssign(orderId: number, staffId: number | "") {
    setAssignBusy(orderId);
    setLocalAssign((prev) => ({ ...prev, [orderId]: staffId }));
    await fetch(`/api/orders/${orderId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: staffId === "" ? null : staffId }),
    });
    setAssignBusy(null);
    showToast(
      staffId === "" ? `Staff unassigned from #${orderId}` : `Staff assigned to order #${orderId}`,
      "success"
    );
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Assign Staff</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const idx = ORDER_STATUS_FLOW.indexOf(o.status as (typeof ORDER_STATUS_FLOW)[number]);
            const canAdvance = idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1;
            const busy = busyId === o.id;
            return (
              <tr key={o.id} className="border-t transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/orders/${o.id}`} className="text-blue-600 hover:underline">
                    #{o.id}
                  </Link>
                  <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{o.customer_name}</p>
                  <p className="text-xs text-gray-400">{o.city}</p>
                </td>
                <td className="px-4 py-3">{formatINR(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100"}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={localAssign[o.id] !== undefined ? localAssign[o.id] : (o.assigned_staff_id ?? "")}
                    onChange={(e) => handleAssign(o.id, e.target.value === "" ? "" : Number(e.target.value))}
                    disabled={assignBusy === o.id}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs outline-none focus:border-blue-400"
                  >
                    <option value="">Unassigned</option>
                    {staff.filter((s) => s.active).map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.area})</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right space-y-1">
                  {canAdvance && (
                    <button
                      onClick={() => act(o.id, "advance")}
                      disabled={busy}
                      className="block w-full rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-700 disabled:opacity-60"
                    >
                      {busy ? "Updating…" : "Next stage →"}
                    </button>
                  )}
                  {o.status === "RETURN_REQUESTED" && (
                    <button
                      onClick={() => act(o.id, "refund")}
                      disabled={busy}
                      className="block w-full rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {busy ? "Updating…" : "Mark Refunded"}
                    </button>
                  )}
                  {o.status === "DELIVERED" && (
                    <span className="text-xs text-green-600 font-medium">✓ Delivered</span>
                  )}
                  {o.status === "REFUNDED" && (
                    <span className="text-xs text-gray-400">Refunded</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
