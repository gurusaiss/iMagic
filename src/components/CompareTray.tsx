"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare-context";

export default function CompareTray() {
  const { ids, count, clear } = useCompare();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-fade-in-up border-t bg-white shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <p className="text-sm font-medium text-gray-700">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {count}
          </span>{" "}
          phone{count > 1 ? "s" : ""} selected for comparison
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={clear}
            className="text-sm text-gray-500 transition-colors hover:text-red-600 hover:underline"
          >
            Clear
          </button>
          <Link
            href={`/compare?ids=${ids.join(",")}`}
            className="btn-primary !px-5 !py-2 text-sm"
          >
            Compare Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
