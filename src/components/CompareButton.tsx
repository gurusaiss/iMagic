"use client";

import { useCompare } from "@/lib/compare-context";
import type { Phone } from "@/lib/types";

export default function CompareButton({ phone }: { phone: Phone }) {
  const { ids, toggle } = useCompare();
  const active = ids.has(phone.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(phone);
      }}
      className={`text-xs font-medium underline-offset-2 hover:underline ${
        active ? "text-[var(--accent)]" : "text-[var(--muted)]"
      }`}
    >
      {active ? "Remove from compare" : "Add to compare"}
    </button>
  );
}
