"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/use-current-user";
import { Order, STATUS_LABELS } from "@/lib/types";
import { formatINR } from "@/lib/format";

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700",
  PACKED: "bg-indigo-100 text-indigo-700",
  OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-green-100 text-green-700",
  RETURN_REQUESTED: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-gray-200 text-gray-600",
};

export default function MyOrdersPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.orders ?? []));
  }, [user]);

  if (!userLoading && !user) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Please log in to view your orders</h1>
        <Link href="/login" className="btn-primary mt-6">
          Login / Sign Up
        </Link>
      </div>
    );
  }

  if (userLoading || orders === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-shimmer h-20 rounded-xl border" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-gray-500">Orders placed on your account will show up here.</p>
        <Link href="/phones" className="btn-primary mt-6">
          Shop phones
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      <div className="space-y-3">
        {orders.map((o, i) => (
          <Link
            key={o.id}
            href={`/orders/${o.id}`}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-fade-in-up flex items-center justify-between rounded-xl border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <p className="font-semibold">Order #{o.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(o.created_at + "Z").toLocaleDateString()} · {formatINR(o.total)}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100"}`}
            >
              {STATUS_LABELS[o.status]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
