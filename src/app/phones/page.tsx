import db from "@/lib/db";
import { Phone } from "@/lib/types";
import PhoneCard from "@/components/PhoneCard";
import Filters from "@/components/Filters";

export const dynamic = "force-dynamic";

type SearchParams = {
  brand?: string;
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  minRam?: string;
  sort?: string;
};

export default async function PhonesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const brands = (
    db.prepare("SELECT DISTINCT brand FROM phones ORDER BY brand").all() as {
      brand: string;
    }[]
  ).map((b) => b.brand);

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (sp.brand) {
    conditions.push("brand = ?");
    params.push(sp.brand);
  }
  if (sp.q) {
    conditions.push("(model LIKE ? OR brand LIKE ? OR processor LIKE ?)");
    const like = `%${sp.q}%`;
    params.push(like, like, like);
  }
  if (sp.minPrice) {
    conditions.push("price >= ?");
    params.push(Number(sp.minPrice));
  }
  if (sp.maxPrice) {
    conditions.push("price <= ?");
    params.push(Number(sp.maxPrice));
  }
  if (sp.minRam) {
    conditions.push("ram_gb >= ?");
    params.push(Number(sp.minRam));
  }

  let orderBy = "rating DESC";
  if (sp.sort === "price_asc") orderBy = "price ASC";
  if (sp.sort === "price_desc") orderBy = "price DESC";
  if (sp.sort === "newest") orderBy = "id DESC";

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const phones = db
    .prepare(`SELECT * FROM phones ${where} ORDER BY ${orderBy}`)
    .all(...params) as Phone[];

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Shop Phones</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <Filters brands={brands} current={sp} />
        <div className="flex-1">
          <p className="mb-4 text-sm text-gray-500">{phones.length} phones found</p>
          {phones.length === 0 ? (
            <div className="rounded-xl border bg-white py-16 text-center text-gray-500">
              <p className="text-4xl">🔍</p>
              <p className="mt-2">No phones match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {phones.map((p, i) => (
                <div
                  key={p.id}
                  style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                  className="animate-fade-in-up"
                >
                  <PhoneCard phone={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
