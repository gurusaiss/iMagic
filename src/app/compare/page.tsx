"use client";

import { useCompare } from "@/lib/compare-context";
import EmptyState from "@/components/EmptyState";

export default function ComparePage() {
  const { phones, remove } = useCompare();

  if (phones.length === 0) {
    return <EmptyState title="No phones selected for comparison." action="Browse phones" actionHref="/phones" />;
  }

  const rows: [string, (p: (typeof phones)[number]) => React.ReactNode][] = [
    ["Price", (p) => `₹${p.price.toLocaleString("en-IN")}`],
    ["Display", (p) => p.display],
    ["Processor", (p) => p.processor],
    ["RAM", (p) => `${p.ram_gb} GB`],
    ["Storage", (p) => `${p.storage_gb} GB`],
    ["Battery", (p) => `${p.battery_mah} mAh`],
    ["Camera", (p) => p.camera],
  ];

  return (
    <div className="section">
      <div className="container-narrow overflow-x-auto">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Compare</h1>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-4 text-left text-muted"></th>
              {phones.map((p) => (
                <th key={p.id} className="p-4 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{p.brand} {p.model}</span>
                    <button onClick={() => remove(p.id)} className="text-muted">
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, render]) => (
              <tr key={label} className="border-t border-[var(--border)]">
                <td className="p-4 text-muted">{label}</td>
                {phones.map((p) => (
                  <td key={p.id} className="p-4">
                    {render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
