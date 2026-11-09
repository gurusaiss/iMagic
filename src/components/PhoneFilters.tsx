"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const PRICE_CHIPS = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₹15,000", min: "0", max: "15000" },
  { label: "₹15,000 – ₹25,000", min: "15000", max: "25000" },
  { label: "₹25,000 – ₹35,000", min: "25000", max: "35000" },
  { label: "Above ₹35,000", min: "35000", max: "" },
];

export default function PhoneFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "";
  const currentMin = searchParams.get("min") ?? "";
  const currentMax = searchParams.get("max") ?? "";
  const currentBrand = searchParams.get("brand") ?? "";

  const [customMin, setCustomMin] = useState(currentMin);
  const [customMax, setCustomMax] = useState(currentMax);

  function updateParam(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val) params.set(key, val);
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleCustomPrice(e: React.FormEvent) {
    e.preventDefault();
    updateParam({ min: customMin || null, max: customMax || null });
  }

  function clearAllFilters() {
    router.push(pathname);
    setCustomMin("");
    setCustomMax("");
  }

  const hasActiveFilters = Boolean(currentMin || currentMax || currentSort || currentBrand);

  return (
    <div className="mb-8 space-y-4 rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-6 shadow-sm">
      {/* Price Quick Filter Chips & Sort Dropdown */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Price Range Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
            Price:
          </span>
          {PRICE_CHIPS.map((chip) => {
            const isSelected =
              (!chip.min && !chip.max && !currentMin && !currentMax) ||
              (chip.min === currentMin && chip.max === currentMax);

            return (
              <button
                key={chip.label}
                onClick={() => updateParam({ min: chip.min || null, max: chip.max || null })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#0071e3] text-white shadow-sm font-semibold"
                    : "border border-gray-200 bg-[#f5f5f7] text-gray-700 hover:border-gray-300 hover:bg-gray-200"
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={currentSort}
            onChange={(e) => updateParam({ sort: e.target.value || null })}
            className="rounded-full border border-gray-200 bg-[#f5f5f7] px-4 py-1.5 text-xs font-semibold text-gray-800 outline-none transition-colors hover:border-gray-300 focus:border-[#0071e3] focus:bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Price Range Form & Active Filter Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <form onSubmit={handleCustomPrice} className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Custom ₹:</span>
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            className="w-20 rounded-lg border border-gray-200 bg-[#f5f5f7] px-2.5 py-1 text-xs text-gray-900 outline-none focus:border-[#0071e3] focus:bg-white"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            className="w-20 rounded-lg border border-gray-200 bg-[#f5f5f7] px-2.5 py-1 text-xs text-gray-900 outline-none focus:border-[#0071e3] focus:bg-white"
          />
          <button
            type="submit"
            className="rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white hover:bg-gray-800 transition-colors"
          >
            Go
          </button>
        </form>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors ml-auto"
          >
            ✕ Reset All Filters
          </button>
        )}
      </div>
    </div>
  );
}
