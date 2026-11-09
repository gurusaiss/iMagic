"use client";

import { useState } from "react";

const PINCODE_RE = /^\d{6}$/;

export default function DeliveryCheck() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!PINCODE_RE.test(pincode)) {
      setError("Enter a valid 6-digit pincode");
      setResult(null);
      return;
    }
    setError(null);
    const days = 2 + (Number(pincode) % 3);
    const date = new Date(Date.now() + days * 86400000).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    setResult(`Delivery by ${date}`);
  }

  return (
    <div className="border-t border-[var(--border)] pt-6">
      <p className="mb-2 text-sm font-medium">Check delivery date</p>
      <form onSubmit={check} className="flex gap-2">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
          maxLength={6}
          className="w-40 rounded-full border border-[var(--border)] px-4 py-2 text-sm"
        />
        <button type="submit" className="btn-secondary px-4 py-2 text-xs">
          Check
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-[var(--danger)]">{error}</p>}
      {result && <p className="mt-2 text-sm text-[var(--success)]">{result}</p>}
    </div>
  );
}
