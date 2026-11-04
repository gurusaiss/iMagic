"use client";

import { useCompare } from "@/lib/compare-context";
import { useToast } from "@/lib/toast-context";

export default function CompareButton({
  phoneId,
  phoneName,
  size = "sm",
}: {
  phoneId: number;
  phoneName: string;
  size?: "sm" | "md";
}) {
  const { has, add, remove, isFull } = useCompare();
  const { showToast } = useToast();
  const active = has(phoneId);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      remove(phoneId);
      showToast(`${phoneName} removed from compare`, "info");
    } else if (isFull) {
      showToast("Compare list full (max 3). Remove one first.", "error");
    } else {
      add(phoneId);
      showToast(`${phoneName} added to compare`, "success");
    }
  }

  const base =
    size === "md"
      ? "px-4 py-2 text-sm rounded-full font-semibold transition-all duration-150 active:scale-95"
      : "px-3 py-1 text-xs rounded-full font-semibold transition-all duration-150 active:scale-95";

  return (
    <button
      onClick={toggle}
      className={`${base} ${
        active
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600"
      }`}
    >
      {active ? "✓ Comparing" : "⚖ Compare"}
    </button>
  );
}
