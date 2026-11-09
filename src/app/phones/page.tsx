import Link from "next/link";
import db from "@/lib/db";
import type { Phone } from "@/lib/types";
import PhoneCard from "@/components/PhoneCard";
import PhoneFilters from "@/components/PhoneFilters";

export const metadata = {
  title: "Shop All Phones — iMagic Apple & Flagship Reseller",
  description: "Browse the full collection of Nexora, Veltrix and Orova flagship smartphones with official warranty and instant bank cashback.",
};

export default async function PhonesPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; sort?: string; min?: string; max?: string }>;
}) {
  const { brand, sort, min, max } = await searchParams;

  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (brand) {
    conditions.push("brand = ?");
    values.push(brand);
  }
  if (min) {
    conditions.push("price >= ?");
    values.push(Number(min));
  }
  if (max) {
    conditions.push("price <= ?");
    values.push(Number(max));
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderBy =
    sort === "price-asc"
      ? "price ASC"
      : sort === "price-desc"
      ? "price DESC"
      : sort === "rating"
      ? "rating DESC"
      : "id DESC";

  const phones = db.prepare(`SELECT * FROM phones ${where} ORDER BY ${orderBy}`).all(...values) as Phone[];

  const brandsWithCount = db
    .prepare("SELECT brand, COUNT(*) as count FROM phones GROUP BY brand ORDER BY brand")
    .all() as { brand: string; count: number }[];

  const totalPhoneCount = (db.prepare("SELECT COUNT(*) as c FROM phones").get() as { c: number }).c;

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 sm:py-12">
      <div className="container-narrow">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 text-xs font-medium text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Shop Phones</span>
          {brand && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-[#0071e3] font-semibold">{brand}</span>
            </>
          )}
        </nav>

        {/* Page Title & Reseller Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0071e3] mb-2 border border-blue-100">
               Authorised Reseller Catalog
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              {brand ? `${brand} Smartphones` : "All Flagship Phones"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Showing {phones.length} of {totalPhoneCount} premium models with official 1-Year brand warranty.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl px-3.5 py-2 shadow-sm">
            <span>✨ Festive Bank Offer:</span>
            <span className="font-semibold text-emerald-600">Extra ₹5,000 Off</span>
          </div>
        </div>

        {/* Brand Tabs (High-Contrast, Apple Aesthetic) */}
        <div className="mb-6 flex flex-wrap gap-2.5">
          <Link
            href="/phones"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              !brand
                ? "bg-[#1d1d1f] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Models ({totalPhoneCount})
          </Link>
          {brandsWithCount.map((b) => (
            <Link
              key={b.brand}
              href={`/phones?brand=${encodeURIComponent(b.brand)}`}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                brand === b.brand
                  ? "bg-[#0071e3] text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {b.brand} ({b.count})
            </Link>
          ))}
        </div>

        {/* Filter Toolbar */}
        <PhoneFilters />

        {/* Product Grid */}
        {phones.length === 0 ? (
          <div className="my-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
            <span className="text-4xl">🔍</span>
            <h3 className="mt-4 text-lg font-bold text-gray-900">No matching models found</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-sm">
              We couldn&apos;t find any phones matching your selected filters. Try broadening your price range or brand selection.
            </p>
            <Link href="/phones" className="btn-primary mt-6">
              View All Phones
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {phones.map((p) => (
              <PhoneCard key={p.id} phone={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
