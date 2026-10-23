"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  brands: string[];
  current: {
    brand?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    minRam?: string;
    sort?: string;
  };
};

export default function Filters({ brands, current }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(current.q ?? "");
  const [minPrice, setMinPrice] = useState(current.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(current.maxPrice ?? "");
  const [minRam, setMinRam] = useState(current.minRam ?? "");

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = { ...current, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/phones?${params.toString()}`;
  }

  function go(url: string) {
    startTransition(() => router.push(url));
  }

  function applyText() {
    go(buildUrl({ q, minPrice, maxPrice, minRam }));
  }

  const selectClass =
    "w-full rounded-lg border px-2 py-1.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <aside
      className={`w-full shrink-0 space-y-6 rounded-xl border bg-white p-4 shadow-sm transition-opacity duration-200 md:w-64 ${
        isPending ? "opacity-50" : "opacity-100"
      }`}
    >
      <div>
        <label className="mb-1 block text-sm font-semibold">Search</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyText()}
          placeholder="model, brand, chipset..."
          className={selectClass}
        />
      </div>

      <div>
        <span className="mb-1 block text-sm font-semibold">Brand</span>
        <div className="flex flex-col gap-1 text-sm">
          <button
            onClick={() => go(buildUrl({ brand: undefined }))}
            className={`text-left transition-colors hover:text-blue-600 ${
              !current.brand ? "font-semibold text-blue-600" : "text-gray-600"
            }`}
          >
            All brands
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => go(buildUrl({ brand: b }))}
              className={`text-left transition-colors hover:text-blue-600 ${
                current.brand === b ? "font-semibold text-blue-600" : "text-gray-600"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-semibold">Price range (₹)</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className={selectClass}
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className={selectClass}
          />
        </div>
      </div>

      <div>
        <span className="mb-1 block text-sm font-semibold">Min RAM</span>
        <select
          value={minRam}
          onChange={(e) => setMinRam(e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          <option value="4">4GB+</option>
          <option value="6">6GB+</option>
          <option value="8">8GB+</option>
          <option value="12">12GB+</option>
        </select>
      </div>

      <button onClick={applyText} disabled={isPending} className="btn-dark w-full !py-2 text-sm">
        {isPending ? "Applying..." : "Apply filters"}
      </button>

      <div>
        <span className="mb-1 block text-sm font-semibold">Sort by</span>
        <select
          value={current.sort ?? ""}
          onChange={(e) => go(buildUrl({ sort: e.target.value || undefined }))}
          className={selectClass}
        >
          <option value="">Top rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <button
        onClick={() => go("/phones")}
        className="w-full text-sm text-gray-500 transition-colors hover:text-gray-800"
      >
        Clear all filters
      </button>
    </aside>
  );
}
