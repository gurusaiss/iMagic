"use client";

import { useState } from "react";
import Link from "next/link";

const BRANDS = ["Nexora", "Veltrix", "Orova", "Other"];
const CONDITIONS = [
  { id: "excellent", label: "Excellent", desc: "No scratches, works perfectly", value: 1 },
  { id: "good", label: "Good", desc: "Minor wear, fully functional", value: 0.7 },
  { id: "fair", label: "Fair", desc: "Visible wear, works fine", value: 0.45 },
];

const BASE_VALUE = 12000;

export default function TradeInPage() {
  const [brand, setBrand] = useState(BRANDS[0]);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [estimated, setEstimated] = useState<number | null>(null);

  function handleEstimate(e: React.FormEvent) {
    e.preventDefault();
    setEstimated(Math.round(BASE_VALUE * condition.value));
  }

  return (
    <div className="section">
      <div className="container-narrow max-w-2xl">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Trade in your old phone</h1>
        <p className="mb-10 text-muted">
          Get an instant estimate and apply the value towards your next iMagic purchase.
        </p>

        <form onSubmit={handleEstimate} className="card flex flex-col gap-6 p-6">
          <div>
            <p className="mb-2 text-sm font-medium">Current phone brand</p>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setBrand(b)}
                  className={`pill ${brand === b ? "bg-[var(--foreground)] text-white" : "bg-[#f5f5f7]"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Condition</p>
            <div className="flex flex-col gap-2">
              {CONDITIONS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCondition(c)}
                  className={`card flex items-center justify-between p-4 text-left ${
                    condition.id === c.id ? "border-[var(--accent)]" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{c.label}</p>
                    <p className="text-xs text-muted">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary self-start">
            Get estimate
          </button>
        </form>

        {estimated !== null && (
          <div className="card mt-6 p-6 text-center">
            <p className="text-sm text-muted">Estimated trade-in value for your {brand} phone</p>
            <p className="my-2 text-3xl font-semibold">₹{estimated.toLocaleString("en-IN")}</p>
            <Link href="/phones" className="btn-primary mt-4 inline-flex">
              Shop phones
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
