"use client";

import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/phones", label: "All Phones" },
      { href: "/phones?brand=Nexora", label: "Nexora" },
      { href: "/phones?brand=Veltrix", label: "Veltrix" },
      { href: "/phones?brand=Orova", label: "Orova" },
      { href: "/compare", label: "Compare" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQs" },
      { href: "/contact", label: "Contact Us" },
      { href: "/orders", label: "Track Order" },
      { href: "/trade-in", label: "Trade-In" },
      { href: "/stores", label: "Find a Store" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About iMagic" },
      { href: "/stores", label: "Store Locator" },
      { href: "/faq", label: "Warranty" },
      { href: "/contact", label: "Careers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[#f5f5f7]">
      <div className="container-narrow grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-3">
          <span className="text-lg font-semibold tracking-tight">iMagic</span>
          <p className="max-w-xs text-sm text-muted">
            Your authorised destination for Nexora, Veltrix and Orova phones — genuine products,
            fast delivery and easy returns.
          </p>
          <form
            action="/api/newsletter"
            className="mt-2 flex max-w-xs items-center gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm"
            />
            <button type="submit" className="btn-primary px-4 py-2 text-xs">
              Join
            </button>
          </form>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            {col.links.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-muted hover:text-[var(--foreground)]">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--border)] py-6">
        <div className="container-narrow flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} iMagic Retail. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-[var(--foreground)]">Privacy</Link>
            <Link href="/faq" className="hover:text-[var(--foreground)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
