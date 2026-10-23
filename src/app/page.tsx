import Link from "next/link";
import db from "@/lib/db";
import { Phone } from "@/lib/types";
import PhoneCard from "@/components/PhoneCard";
import HeroBanner from "@/components/HeroBanner";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const brands = db
    .prepare("SELECT DISTINCT brand FROM phones ORDER BY brand")
    .all() as { brand: string }[];

  const featured = db
    .prepare("SELECT * FROM phones ORDER BY rating DESC LIMIT 4")
    .all() as Phone[];

  const budget = db
    .prepare("SELECT * FROM phones ORDER BY price ASC LIMIT 4")
    .all() as Phone[];

  const brandAccents = ["bg-blue-600", "bg-orange-500", "bg-emerald-600", "bg-purple-600"];

  return (
    <div>
      <HeroBanner />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-4 text-lg font-semibold">Shop by brand</h2>
        <div className="flex flex-wrap gap-3">
          {brands.map((b, i) => (
            <Link
              key={b.brand}
              href={`/phones?brand=${encodeURIComponent(b.brand)}`}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-in-up flex items-center gap-2 rounded-full border bg-white px-5 py-2 text-sm font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${brandAccents[i % brandAccents.length]}`}
              />
              {b.brand}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Top rated <span className="text-amber-500">★</span>
          </h2>
          <Link href="/phones" className="text-sm text-blue-600 transition-colors hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in-up">
              <PhoneCard phone={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Best value picks</h2>
          <Link
            href="/phones?sort=price_asc"
            className="text-sm text-blue-600 transition-colors hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {budget.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in-up">
              <PhoneCard phone={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
