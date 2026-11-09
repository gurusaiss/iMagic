"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare-context";

export default function CompareTray() {
  const { phones, remove, clear } = useCompare();

  if (phones.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 hidden border-t border-[var(--border)] bg-white/95 backdrop-blur-xl md:block">
      <div className="container-narrow flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          {phones.map((p) => (
            <div key={p.id} className="flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs">
              <span>{p.brand} {p.model}</span>
              <button onClick={() => remove(p.id)} className="text-[var(--muted)]">
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={clear} className="text-xs text-[var(--muted)]">
            Clear
          </button>
          <Link href="/compare" className="btn-primary text-xs">
            Compare ({phones.length})
          </Link>
        </div>
      </div>
    </div>
  );
}
