import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import type { Phone } from "@/lib/types";
import PhoneCard from "@/components/PhoneCard";

const BRANDS = [
  {
    name: "Nexora",
    tagline: "Pro Power. Titanium Build.",
    desc: "From the revolutionary Fold Mini to the powerhouse X1 Pro.",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    accent: "#38bdf8",
  },
  {
    name: "Veltrix",
    tagline: "108MP Studio Camera. 144Hz.",
    desc: "Engineered for creators, power users, and multi-day battery life.",
    bg: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
    accent: "#a1a1aa",
  },
  {
    name: "Orova",
    tagline: "Curved AMOLED. 5G Mastery.",
    desc: "Ultra-slim 6.9mm profile with radiant curved edge aesthetics.",
    bg: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
    accent: "#34d399",
  },
];

const PROMOTIONAL_PERKS = [
  {
    icon: "",
    title: "100% Genuine Guarantee",
    desc: "Sourced directly with 1-Year brand warranty",
  },
  {
    icon: "💳",
    title: "Instant Bank Cashback",
    desc: "Up to ₹5,000 instant off on HDFC & ICICI cards",
  },
  {
    icon: "⚡",
    title: "Express 24h Delivery",
    desc: "Free insured shipping across 500+ Indian cities",
  },
  {
    icon: "🔄",
    title: "Limitless Trade-In",
    desc: "Get instant value & bonus exchange on old devices",
  },
];

export default function Home() {
  const heroPhone = db
    .prepare("SELECT * FROM phones WHERE model = 'Nexora Fold Mini' OR rating >= 4.7 LIMIT 1")
    .get() as Phone | undefined;

  const featured = db
    .prepare("SELECT * FROM phones ORDER BY rating DESC LIMIT 4")
    .all() as Phone[];

  const budgetDeals = db
    .prepare("SELECT * FROM phones ORDER BY price ASC LIMIT 4")
    .all() as Phone[];

  return (
    <div className="bg-[#f5f5f7]">
      {/* 1. Cinematic Apple Flagship Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#000000] via-[#090d16] to-[#0f172a] text-white pt-12 pb-20 px-4 text-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-4xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-300 backdrop-blur-md mb-4">
            <span>✨ Festive Reseller Offer</span>
            <span className="text-white/40">·</span>
            <span>Up to ₹5,000 Instant Cashback</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-3xl leading-[1.08]">
            Titanium. Foldable. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Impossibly Pro.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base sm:text-lg text-gray-300 font-normal">
            Experience the new Nexora Fold Mini and the flagship Pro lineup. Built with aerospace titanium, 120Hz ProMotion, and all-day battery.
          </p>

          <p className="mt-3 text-sm font-medium text-amber-300">
            From ₹1,833/mo* with No Cost EMI or ₹21,999 incl. GST
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/phones" className="btn-primary !px-7 !py-3 !text-sm !font-semibold">
              Shop Flagship Series
            </Link>
            <Link href="/compare" className="btn-secondary !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 !px-7 !py-3 !text-sm">
              Compare All Models →
            </Link>
          </div>

          {/* Hero Smartphone Showcase Visual */}
          {heroPhone && (
            <div className="mt-12 relative w-full max-w-xs sm:max-w-sm flex items-center justify-center">
              <div className="transition-transform duration-500 hover:scale-105">
                <Image
                  src={heroPhone.image}
                  alt={heroPhone.model}
                  width={280}
                  height={380}
                  className="h-72 sm:h-96 w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,113,227,0.35)]"
                  priority
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. Aptronix / Imagine Style Value Ribbon */}
      <section className="border-y border-gray-200 bg-white py-8 px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-6 lg:grid-cols-4">
          {PROMOTIONAL_PERKS.map((perk) => (
            <div key={perk.title} className="flex items-start gap-3.5 p-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-[#0071e3] border border-blue-100">
                {perk.icon}
              </span>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{perk.title}</h4>
                <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Top Rated / Flagship Grid */}
      <section className="section">
        <div className="container-narrow">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-[#0071e3]">
                Authorised Lineup
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Top Rated Smartphones
              </h2>
            </div>
            <Link
              href="/phones"
              className="text-sm font-semibold text-[#0071e3] hover:text-[#0077ed] transition-colors"
            >
              View all phones ({featured.length + budgetDeals.length}+) →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Shop by Brand Ecosystem (Aptronix Style Cards) */}
      <section className="section bg-white border-y border-gray-200">
        <div className="container-narrow">
          <div className="mb-8 text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              Explore by Brand
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Official warranty, authorized service, and guaranteed genuine accessories for every device.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {BRANDS.map((b) => (
              <Link
                key={b.name}
                href={`/phones?brand=${b.name}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 text-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                style={{ background: b.bg }}
              >
                <div>
                  <span
                    className="inline-block rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase mb-3 border border-white/20"
                    style={{ color: b.accent }}
                  >
                    Official Reseller
                  </span>
                  <h3 className="text-2xl font-bold text-white">{b.name}</h3>
                  <p className="mt-1 text-sm font-medium" style={{ color: b.accent }}>
                    {b.tagline}
                  </p>
                  <p className="mt-2 text-xs text-gray-300 leading-relaxed">
                    {b.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:gap-2.5 transition-all">
                  <span>Explore {b.name} Series</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Best Value Deals Under ₹20,000 */}
      <section className="section">
        <div className="container-narrow">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-emerald-600">
                Exclusive Festive Pricing
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                Best Value Picks
              </h2>
            </div>
            <Link
              href="/phones?sort=price_asc"
              className="text-sm font-semibold text-[#0071e3] hover:text-[#0077ed] transition-colors"
            >
              Browse deals under ₹20,000 →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {budgetDeals.map((phone) => (
              <PhoneCard key={phone.id} phone={phone} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Aptronix "Limitless Exchange" / Trade-in Banner */}
      <section className="section pt-0">
        <div className="container-narrow">
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-white via-blue-50/50 to-indigo-50/30 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-[#0071e3]">
                🔄 Limitless Exchange Program
              </span>
              <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Upgrade to a new phone and save up to ₹15,000.
              </h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Exchange any working smartphone for instant credit towards your new iMagic purchase. Plus, get an additional ₹3,000 exchange bonus this week.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/trade-in" className="btn-primary">
                  Calculate Trade-In Value
                </Link>
                <Link href="/stores" className="btn-secondary">
                  Visit Nearest Store
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-sm p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-[#0071e3]">₹15,000</p>
                <p className="text-xs text-gray-500 mt-1">Max Trade-In Value</p>
              </div>
              <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-sm p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-emerald-600">₹3,000</p>
                <p className="text-xs text-gray-500 mt-1">Extra Bonus Credit</p>
              </div>
              <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-sm p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-900">2 Mins</p>
                <p className="text-xs text-gray-500 mt-1">Instant Appraisal</p>
              </div>
              <div className="rounded-2xl border border-white bg-white/80 backdrop-blur-sm p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-amber-600">Doorstep</p>
                <p className="text-xs text-gray-500 mt-1">Free Pickup</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
