"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Order, ORDER_STATUS_FLOW, STATUS_LABELS } from "@/lib/types";
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

export default function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [busyId, setBusyId] = useState<number | null>(null);

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

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const idx = ORDER_STATUS_FLOW.indexOf(
              o.status as (typeof ORDER_STATUS_FLOW)[number]
            );
            const canAdvance = idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1;
            const busy = busyId === o.id;
            return (
              <tr key={o.id} className="border-t transition-colors hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/orders/${o.id}`}
                    className="text-blue-600 transition-colors hover:underline"
                  >
                    #{o.id}
                  </Link>
                </td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3">{formatINR(o.total)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100"}`}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {canAdvance && (
                    <button
                      onClick={() => act(o.id, "advance")}
                      disabled={busy}
                      className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white transition-all duration-150 hover:bg-gray-700 active:scale-95 disabled:opacity-60"
                    >
                      {busy ? "Updating..." : "Move to next stage →"}
                    </button>
                  )}
                  {o.status === "RETURN_REQUESTED" && (
                    <button
                      onClick={() => act(o.id, "refund")}
                      disabled={busy}
                      className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition-all duration-150 hover:bg-red-700 active:scale-95 disabled:opacity-60"
                    >
                      {busy ? "Updating..." : "Mark Refunded"}
                    </button>
                  )}
                  {o.status === "DELIVERED" && (
                    <span className="text-xs text-gray-400">Delivered</span>
                  )}
                  {o.status === "REFUNDED" && (
                    <span className="text-xs text-gray-400">Closed</span>
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
