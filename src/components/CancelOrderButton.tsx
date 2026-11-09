"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";

export default function CancelOrderButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel this order?")) return;
    setLoading(true);
    const res = await apiFetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <button onClick={handleCancel} disabled={loading} className="btn-secondary text-sm">
      {loading ? "Cancelling..." : "Cancel order"}
    </button>
  );
}
