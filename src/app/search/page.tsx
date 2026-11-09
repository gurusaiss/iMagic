import db from "@/lib/db";
import type { Phone } from "@/lib/types";
import PhoneCard from "@/components/PhoneCard";
import EmptyState from "@/components/EmptyState";

export const metadata = { title: "Search — iMagic" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const results = query
    ? (db
        .prepare(
          `SELECT * FROM phones WHERE brand LIKE ? OR model LIKE ? OR processor LIKE ? ORDER BY rating DESC`
        )
        .all(`%${query}%`, `%${query}%`, `%${query}%`) as Phone[])
    : [];

  if (!query) {
    return <EmptyState title="Search for a brand, model or processor." action="Browse all phones" actionHref="/phones" />;
  }

  if (results.length === 0) {
    return <EmptyState title={`No phones matched "${query}".`} action="Browse all phones" actionHref="/phones" />;
  }

  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Results for &quot;{query}&quot;</h1>
        <p className="mb-10 text-muted">
          {results.length} phone{results.length === 1 ? "" : "s"} found
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((p) => (
            <PhoneCard key={p.id} phone={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
