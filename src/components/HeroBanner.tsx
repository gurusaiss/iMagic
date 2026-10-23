"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Big Phone Days",
    subtitle: "Up to 40% off on flagship Veltrix & Orova phones",
    cta: "Shop the sale",
    href: "/phones?sort=price_asc",
    from: "from-orange-500",
    to: "to-amber-500",
  },
  {
    title: "New Nexora Fold Mini",
    subtitle: "Flagship power in a compact foldable body",
    cta: "View details",
    href: "/phones?brand=Nexora",
    from: "from-purple-600",
    to: "to-indigo-600",
  },
  {
    title: "Budget Picks Under ₹15,000",
    subtitle: "Solid everyday phones that don't break the bank",
    cta: "Browse budget phones",
    href: "/phones?maxPrice=15000",
    from: "from-blue-700",
    to: "to-blue-900",
  },
];

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section
      className={`bg-gradient-to-br ${slide.from} ${slide.to} text-white transition-colors duration-700`}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:py-20">
        <h1 className="text-3xl font-extrabold sm:text-5xl">{slide.title}</h1>
        <p className="mt-4 text-lg text-white/90">{slide.subtitle}</p>
        <Link
          href={slide.href}
          className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-semibold text-gray-900 shadow hover:bg-gray-50"
        >
          {slide.cta}
        </Link>
        <div className="mt-8 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
