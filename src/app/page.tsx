import Link from "next/link";
import db from "@/lib/db";
import type { Phone } from "@/lib/types";
import PhoneCard from "@/components/PhoneCard";

const BRANDS = [
  { name: "Nexora", tagline: "Everyday performance", color: "#1e293b" },
  { name: "Veltrix", tagline: "Flagship power", color: "#374151" },
  { name: "Orova", tagline: "Bold design", color: "#065f46" },
];

const TRUST_BADGES = [
  { title: "100% Genuine", desc: "Sourced directly from authorised brand partners" },
  { title: "Fast Delivery", desc: "2-4 business days across India" },
  { title: "7-Day Returns", desc: "Easy, no-questions-asked returns" },
  { title: "Secure Payments", desc: "UPI, cards, net banking & EMI" },
];

export default function Home() {
  const featured = db
    .prepare("SELECT * FROM phones ORDER BY rating DESC LIMIT 4")
    .all() as Phone[];

  return (
    <div>
      <section className="section bg-white text-center">
        <div className="container-narrow flex flex-col items-center gap-6">
          <p className="pill bg-[#f5f5f7] text-muted">Authorised Reseller</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            The phone that&apos;s right for you.
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Explore the full lineup from Nexora, Veltrix and Orova — with fast delivery and easy returns.
          </p>
          <div className="flex gap-4">
            <Link href="/phones" className="btn-primary">
              Shop all phones
            </Link>
            <Link href="/compare" className="btn-secondary">
              Compare models
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[#f5f5f7] py-10">
        <div className="container-narrow grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST_BADGES.map((b) => (
            <div key={b.title} className="text-center">
              <p className="text-sm font-semibold">{b.title}</p>
              <p className="mt-1 text-xs text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-narrow">
          <h2 className="mb-10 text-3xl font-semibold tracking-tight">Top rated</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-narrow">
          <h2 className="mb-10 text-3xl font-semibold tracking-tight">Shop by brand</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BRANDS.map((b) => (
              <Link
                key={b.name}
                href={`/phones?brand=${b.name}`}
                className="card flex flex-col justify-between gap-10 p-8"
                style={{ background: b.color, color: "white", border: "none" }}
              >
                <div>
                  <h3 className="text-2xl font-semibold">{b.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{b.tagline}</p>
                </div>
                <span className="text-sm underline-offset-4 hover:underline">Shop {b.name} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-narrow card flex flex-col items-center gap-4 bg-[#f5f5f7] p-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Have an old phone?</h2>
          <p className="max-w-md text-muted">
            Trade it in for instant value towards your next iMagic purchase.
          </p>
          <Link href="/trade-in" className="btn-primary">
            Get a trade-in estimate
          </Link>
        </div>
      </section>
    </div>
  );
}
