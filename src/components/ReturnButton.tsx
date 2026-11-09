"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";

export default function ReturnButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReturn() {
    if (!confirm("Request a return for this order?")) return;
    setLoading(true);
    const res = await apiFetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "return" }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <button onClick={handleReturn} disabled={loading} className="btn-secondary text-sm">
      {loading ? "Requesting..." : "Request return"}
    </button>
  );
}
