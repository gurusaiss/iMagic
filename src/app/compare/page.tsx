import Link from "next/link";
import db from "@/lib/db";
import { Phone } from "@/lib/types";
import { formatINR } from "@/lib/format";
import CompareButton from "@/components/CompareButton";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const sp = await searchParams;
  const idList = (sp.ids ?? "")
    .split(",")
    .map(Number)
    .filter((n) => n > 0)
    .slice(0, 3);

  if (idList.length < 2) {
    return (
      <div className="animate-fade-in mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-5xl">⚖</p>
        <h1 className="mt-4 text-xl font-bold">Select 2–3 phones to compare</h1>
        <p className="mt-2 text-sm text-gray-500">
          Browse phones and tap the &quot;Compare&quot; button on at least 2 models.
        </p>
        <Link href="/phones" className="btn-primary mt-6">
          Browse Phones
        </Link>
      </div>
    );
  }

  const placeholders = idList.map(() => "?").join(",");
  const phones = db
    .prepare(`SELECT * FROM phones WHERE id IN (${placeholders})`)
    .all(...idList) as Phone[];

  // Maintain the order the user selected
  const sorted = idList
    .map((id) => phones.find((p) => p.id === id))
    .filter(Boolean) as Phone[];

  const specRows: { label: string; key: keyof Phone | "discount"; render?: (p: Phone) => string }[] = [
    { label: "Brand", key: "brand" },
    { label: "Price", key: "price", render: (p) => formatINR(p.price) },
    { label: "MRP", key: "mrp", render: (p) => formatINR(p.mrp) },
    {
      label: "Discount",
      key: "discount",
      render: (p) => `${Math.round(((p.mrp - p.price) / p.mrp) * 100)}% off`,
    },
    { label: "Display", key: "display" },
    { label: "Processor", key: "processor" },
    { label: "RAM", key: "ram_gb", render: (p) => `${p.ram_gb} GB` },
    { label: "Storage", key: "storage_gb", render: (p) => `${p.storage_gb} GB` },
    { label: "Battery", key: "battery_mah", render: (p) => `${p.battery_mah} mAh` },
    { label: "Camera", key: "camera" },
    { label: "Color", key: "color" },
    { label: "Rating", key: "rating", render: (p) => `${p.rating.toFixed(1)} ★` },
    { label: "Stock", key: "stock", render: (p) => (p.stock > 0 ? `${p.stock} units` : "Out of stock") },
  ];

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-4 text-xs text-gray-500">
        <Link href="/" className="hover:underline">Home</Link>{" / "}
        <Link href="/phones" className="hover:underline">Phones</Link>{" / "}
        <span className="text-gray-700">Compare</span>
      </nav>

      <h1 className="mb-6 text-2xl font-bold">Compare Phones</h1>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 min-w-[120px] bg-gray-50 px-4 py-3 text-gray-500">
                Model
              </th>
              {sorted.map((p) => (
                <th key={p.id} className="min-w-[200px] px-4 py-3">
                  <div className="flex flex-col items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.model}
                      className="h-28 w-28 object-contain"
                    />
                    <Link
                      href={`/phones/${p.id}`}
                      className="text-center font-semibold text-blue-600 transition-colors hover:underline"
                    >
                      {p.model}
                    </Link>
                    <CompareButton phoneId={p.id} phoneName={p.model} size="sm" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row, i) => (
              <tr
                key={row.label}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}
              >
                <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-gray-500">
                  {row.label}
                </td>
                {sorted.map((p) => {
                  const val = row.render
                    ? row.render(p)
                    : String(p[row.key as keyof Phone] ?? "");

                  // Highlight best value for numeric comparisons
                  let highlight = "";
                  if (row.key === "price") {
                    const lowest = Math.min(...sorted.map((s) => s.price));
                    if (p.price === lowest) highlight = "text-green-700 font-semibold";
                  }
                  if (row.key === "rating") {
                    const highest = Math.max(...sorted.map((s) => s.rating));
                    if (p.rating === highest) highlight = "text-green-700 font-semibold";
                  }
                  if (row.key === "ram_gb") {
                    const highest = Math.max(...sorted.map((s) => s.ram_gb));
                    if (p.ram_gb === highest) highlight = "text-green-700 font-semibold";
                  }
                  if (row.key === "battery_mah") {
                    const highest = Math.max(...sorted.map((s) => s.battery_mah));
                    if (p.battery_mah === highest) highlight = "text-green-700 font-semibold";
                  }

                  return (
                    <td key={p.id} className={`px-4 py-3 ${highlight}`}>
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Link href="/phones" className="btn-secondary">
          ← Back to All Phones
        </Link>
      </div>
    </div>
  );
}
