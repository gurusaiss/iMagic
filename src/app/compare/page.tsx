"use client";

import Link from "next/link";
import Image from "next/image";
import { useCompare } from "@/lib/compare-context";
import EmptyState from "@/components/EmptyState";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

export default function ComparePage() {
  const { phones, remove } = useCompare();
  const { add } = useCart();
  const { show } = useToast();

  if (phones.length === 0) {
    return (
      <EmptyState
        title="No phones selected for comparison."
        description="Select up to 3 phones from the catalog to compare display, processor, camera, and battery side by side."
        action="Browse Flagship Phones"
        actionHref="/phones"
      />
    );
  }

  function formatINR(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  }

  const rows: [string, string, (p: (typeof phones)[number]) => React.ReactNode][] = [
    ["Price & Value", "Selling Price", (p) => (
      <div>
        <p className="text-xl font-bold text-gray-900">{formatINR(p.price)}</p>
        <p className="text-xs text-gray-400 line-through">{formatINR(p.mrp)}</p>
      </div>
    )],
    ["Financing", "No-Cost EMI", (p) => (
      <span className="text-xs font-semibold text-[#0071e3]">
        From {formatINR(Math.round(p.price / 12))}/mo
      </span>
    )],
    ["Display", "Screen Type & Refresh", (p) => (
      <span className="font-medium text-gray-800">{p.display}</span>
    )],
    ["Performance", "Processor & Chipset", (p) => (
      <span className="font-semibold text-gray-900">{p.processor}</span>
    )],
    ["Memory", "RAM Capacity", (p) => (
      <span className="font-semibold text-gray-900">{p.ram_gb} GB High-Speed LPDDR5</span>
    )],
    ["Storage", "Internal Storage", (p) => (
      <span className="font-semibold text-gray-900">{p.storage_gb} GB UFS 3.1</span>
    )],
    ["Battery", "Capacity & Endurance", (p) => (
      <span className="font-semibold text-gray-900">{p.battery_mah} mAh All-Day Battery</span>
    )],
    ["Optics", "Camera System", (p) => (
      <span className="font-medium text-gray-800">{p.camera}</span>
    )],
    ["Finish", "Available Color", (p) => (
      <span className="text-xs font-medium text-gray-700">{p.color}</span>
    )],
    ["Customer Rating", "Verified Score", (p) => (
      <div className="flex items-center gap-1.5">
        <span className="text-amber-500 font-bold">★</span>
        <span className="font-bold text-gray-900">{p.rating.toFixed(1)}</span>
        <span className="text-xs text-gray-400">/ 5.0</span>
      </div>
    )],
    ["Availability", "Stock Status", (p) => (
      <span className={`text-xs font-bold ${p.stock > 0 ? "text-emerald-700" : "text-red-600"}`}>
        {p.stock > 0 ? `In Stock (${p.stock} units)` : "Sold Out"}
      </span>
    )],
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 sm:py-16">
      <div className="container-narrow">
        {/* Header */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0071e3] border border-blue-100">
             Model Comparison Tool
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Compare Models Side by Side
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Get the specs on each smartphone and find the device that fits your needs.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="w-48 p-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Feature
                </th>
                {phones.map((p) => (
                  <th key={p.id} className="min-w-[220px] p-4 align-top">
                    <div className="flex flex-col items-center text-center relative group">
                      <button
                        onClick={() => remove(p.id)}
                        className="absolute right-0 top-0 h-6 w-6 rounded-full bg-gray-100 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove from comparison"
                      >
                        ✕
                      </button>

                      <div className="my-2 h-44 flex items-center justify-center">
                        <Image
                          src={p.image}
                          alt={p.model}
                          width={140}
                          height={180}
                          className="h-40 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      </div>

                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0071e3] mt-2">
                        {p.brand}
                      </p>
                      <h3 className="text-base font-bold text-gray-900 mt-0.5">
                        {p.model}
                      </h3>
                      <p className="text-sm font-extrabold text-gray-900 mt-1">
                        {formatINR(p.price)}
                      </p>

                      <div className="mt-4 flex w-full gap-2">
                        <Link
                          href={`/phones/${p.id}`}
                          className="btn-primary !w-full !py-1.5 !text-xs !font-semibold"
                        >
                          Buy
                        </Link>
                        <button
                          onClick={() => {
                            add(p, 1);
                            show(`${p.model} added to bag!`, "success");
                          }}
                          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full border border-gray-200 bg-[#f5f5f7] hover:bg-gray-200"
                          title="Add to Cart"
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {rows.map(([category, label, render]) => (
                <tr key={label} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-semibold text-gray-600 bg-[#fbfbfd]">
                    <span className="block text-[10px] uppercase font-bold text-gray-400">{category}</span>
                    <span className="text-gray-900">{label}</span>
                  </td>
                  {phones.map((p) => (
                    <td key={p.id} className="p-4 text-center sm:text-left">
                      {render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/phones" className="text-xs font-semibold text-[#0071e3] hover:underline">
            ← Browse more phones to compare
          </Link>
        </div>
      </div>
    </div>
  );
}
