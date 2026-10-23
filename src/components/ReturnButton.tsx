"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/lib/toast-context";

export default function ReturnButton({ orderId }: { orderId: number }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleReturn() {
    if (!confirm("Request a return/refund for this order?")) return;
    setLoading(true);
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "return" }),
    });
    setLoading(false);
    if (res.ok) {
      showToast("Return requested — we'll be in touch", "success");
      router.refresh();
    } else {
      showToast("Could not submit return request", "error");
    }
  }

  return (
    <button onClick={handleReturn} disabled={loading} className="btn-danger">
      {loading ? "Submitting..." : "Request Return / Refund"}
    </button>
  );
}
