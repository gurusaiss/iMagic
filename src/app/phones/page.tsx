import Link from "next/link";
import db from "@/lib/db";
import type { Phone } from "@/lib/types";
import PhoneCard from "@/components/PhoneCard";
import PhoneFilters from "@/components/PhoneFilters";

export const metadata = { title: "Shop Phones — iMagic" };

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
    sort === "price-asc" ? "price ASC" : sort === "price-desc" ? "price DESC" : sort === "rating" ? "rating DESC" : "id DESC";

  const phones = db.prepare(`SELECT * FROM phones ${where} ORDER BY ${orderBy}`).all(...values) as Phone[];

  const brands = (db.prepare("SELECT DISTINCT brand FROM phones ORDER BY brand").all() as { brand: string }[]).map(
    (r) => r.brand
  );

  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Shop phones</h1>
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/phones" className={`pill ${!brand ? "bg-[var(--foreground)] text-white" : "bg-[#f5f5f7]"}`}>
            All
          </Link>
          {brands.map((b) => (
            <Link
              key={b}
              href={`/phones?brand=${b}`}
              className={`pill ${brand === b ? "bg-[var(--foreground)] text-white" : "bg-[#f5f5f7]"}`}
            >
              {b}
            </Link>
          ))}
        </div>
        <PhoneFilters />
        {phones.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-muted">No phones match these filters.</p>
            <Link href="/phones" className="btn-secondary">
              Clear filters
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
