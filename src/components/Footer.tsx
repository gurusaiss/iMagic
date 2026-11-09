"use client";

import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop Flagships",
    links: [
      { href: "/phones", label: "All Smartphones" },
      { href: "/phones?brand=Nexora", label: "Nexora Pro & Fold" },
      { href: "/phones?brand=Veltrix", label: "Veltrix 108MP Series" },
      { href: "/phones?brand=Orova", label: "Orova 5G Curved" },
      { href: "/compare", label: "Compare Models" },
      { href: "/trade-in", label: "Trade-In & Exchange" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { href: "/orders", label: "Track Your Order" },
      { href: "/stores", label: "Find 50+ Stores" },
      { href: "/faq", label: "Warranty & Repairs" },
      { href: "/contact", label: "Contact Helpline" },
      { href: "/faq", label: "Return & Refund Policy" },
      { href: "/faq", label: "No-Cost EMI Plans" },
    ],
  },
  {
    title: "About iMagic",
    links: [
      { href: "/about", label: "Company Overview" },
      { href: "/stores", label: "Experience Centers" },
      { href: "/about", label: "Corporate Sales" },
      { href: "/contact", label: "Careers at iMagic" },
      { href: "/about", label: "Reseller Credentials" },
    ],
  },
];

const PAYMENT_METHODS = ["UPI / QR", "RuPay", "Visa", "Mastercard", "Net Banking", "No-Cost EMI"];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-[#f5f5f7] text-gray-700">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-gray-200 bg-white py-8">
        <div className="container-narrow flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-bold text-[#0071e3] border border-blue-100">
              
            </span>
            <div>
              <p className="font-bold text-gray-900 text-sm">Apple &amp; Flagship Premium Reseller</p>
              <p className="text-xs text-gray-500">Authorized by official Indian brand distributors</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_METHODS.map((pm) => (
              <span
                key={pm}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow-2xs"
              >
                💳 {pm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Directory Columns */}
      <div className="container-narrow grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">iMagic</span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#0071e3] border border-blue-200">
              Authorised Reseller
            </span>
          </div>
          <p className="max-w-sm text-xs text-gray-500 leading-relaxed">
            iMagic is India&apos;s premier destination for genuine flagship smartphones. Every device comes with an official brand warranty, GST invoice, and express 24h insured delivery.
          </p>
          <div className="mt-1 space-y-1 text-xs text-gray-600">
            <p>📞 <strong>Toll-Free Helpline:</strong> 1800-IMAGIC (9 AM – 9 PM)</p>
            <p>✉️ <strong>Customer Care:</strong> support@imagicreseller.in</p>
            <p>📍 <strong>Registered Office:</strong> Level 4, DLF Cyber City, Gurugram, India</p>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">{col.title}</h4>
            <div className="flex flex-col gap-2">
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-gray-600 hover:text-[#0071e3] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Legal Disclaimers & Copyright */}
      <div className="border-t border-gray-200 py-6 text-[11px] text-gray-500">
        <div className="container-narrow flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} iMagic Retail India Pvt. Ltd. All rights reserved. GSTIN: 07AAACI1234F1Z8.
          </p>
          <div className="flex gap-4">
            <Link href="/faq" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">Terms of Sale</Link>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">Shipping &amp; Delivery</Link>
            <Link href="/faq" className="hover:text-gray-900 transition-colors">Grievance Redressal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
