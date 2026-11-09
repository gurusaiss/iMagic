import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import type { Phone } from "@/lib/types";
import AddToCartBox from "@/components/AddToCartBox";
import WishlistButton from "@/components/WishlistButton";
import CompareButton from "@/components/CompareButton";
import PhoneCard from "@/components/PhoneCard";
import StarRating from "@/components/StarRating";
import Reviews from "@/components/Reviews";
import DeliveryCheck from "@/components/DeliveryCheck";
import StickyBuyBar from "@/components/StickyBuyBar";
import ProductBadge from "@/components/ProductBadge";

const COLOR_SWATCHES: Record<string, string> = {
  "Midnight Black": "#1e293b",
  "Jet Black": "#0f172a",
  "Ocean Blue": "#1e40af",
  "Coral Red": "#e11d48",
  "Pearl White": "#f1f5f9",
  "Graphite Grey": "#475569",
  "Titanium Silver": "#94a3b8",
  "Sunset Orange": "#ea580c",
  "Emerald Green": "#059669",
  "Lavender Purple": "#7c3aed",
};

export default async function PhoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const phone = db.prepare("SELECT * FROM phones WHERE id = ?").get(id) as Phone | undefined;
  if (!phone) notFound();

  const related = db
    .prepare("SELECT * FROM phones WHERE brand = ? AND id != ? LIMIT 4")
    .all(phone.brand, phone.id) as Phone[];

  const specs = [
    ["Display", phone.display],
    ["Processor", phone.processor],
    ["RAM", `${phone.ram_gb} GB`],
    ["Storage", `${phone.storage_gb} GB`],
    ["Battery", `${phone.battery_mah} mAh`],
    ["Camera", phone.camera],
    ["Finish", phone.color],
    ["Warranty", "1-Year Official Brand Warranty"],
    ["In the Box", "Handset, USB-C to C Braided Cable, SIM Ejector, Documentation"],
  ];

  const discount = Math.round(((phone.mrp - phone.price) / phone.mrp) * 100);
  const emiPerMonth = Math.round(phone.price / 12);
  const swatchColor = COLOR_SWATCHES[phone.color] ?? "#334155";

  function formatINR(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-8 pb-28 md:pb-16">
      <div className="container-narrow">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/phones" className="hover:text-gray-900 transition-colors">Phones</Link>
          <span>/</span>
          <Link href={`/phones?brand=${encodeURIComponent(phone.brand)}`} className="hover:text-gray-900 transition-colors">
            {phone.brand}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{phone.model}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Product Image Gallery / Stage */}
          <div className="lg:col-span-6">
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center relative">
              <div className="absolute right-6 top-6 z-10">
                <div className="rounded-full bg-[#f5f5f7] p-1 hover:bg-gray-200 transition-colors">
                  <WishlistButton phoneId={phone.id} />
                </div>
              </div>

              <div className="absolute left-6 top-6 z-10">
                <ProductBadge rating={phone.rating} />
              </div>

              <div className="my-6">
                <Image
                  src={phone.image}
                  alt={`${phone.brand} ${phone.model}`}
                  width={320}
                  height={420}
                  className="h-80 sm:h-96 w-auto object-contain drop-shadow-2xl"
                  priority
                  unoptimized
                />
              </div>

              {/* Color Finish Callout */}
              <div className="mt-4 flex items-center gap-2 rounded-full border border-gray-200 bg-[#f5f5f7] px-4 py-1.5 shadow-2xs">
                <span
                  className="h-3.5 w-3.5 rounded-full border border-gray-300 shadow-inner"
                  style={{ backgroundColor: swatchColor }}
                />
                <span className="text-xs font-semibold text-gray-800">
                  Finish: {phone.color}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Specs & Purchase Box */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-0.5 text-xs font-semibold text-[#0071e3] mb-2 border border-blue-100">
                 Official Authorised Reseller Product
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                {phone.model}
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {phone.brand} · {phone.ram_gb}GB RAM · {phone.storage_gb}GB Storage · {phone.color}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  <StarRating rating={phone.rating} size={14} />
                  <span className="text-xs font-bold text-emerald-800">{phone.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-500">Verified Buyer Ratings</span>
              </div>
            </div>

            {/* Price & EMI Box */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">{formatINR(phone.price)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-base text-gray-400 line-through">{formatINR(phone.mrp)}</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      Save {discount}% ({formatINR(phone.mrp - phone.price)})
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">MRP inclusive of all taxes &amp; GST invoice provided.</p>

              {/* No-Cost EMI callout */}
              <div className="mt-3 rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs text-gray-700 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#0071e3]">No Cost EMI</span> from{" "}
                  <strong className="text-gray-900">{formatINR(emiPerMonth)}/month</strong> (12 mos)
                </div>
                <Link href="/faq" className="text-[#0071e3] font-semibold hover:underline">
                  Plans →
                </Link>
              </div>
            </div>

            {/* Bank Cashback Promotion Banner (Aptronix Style) */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <span>💳 Instant Bank Offer:</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Get up to <strong>₹5,000 instant cashback</strong> on HDFC &amp; ICICI Bank Credit Card Full Swipe &amp; EMI transactions.
              </p>
            </div>

            {/* Add to Cart & Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
              <AddToCartBox phone={phone} />
              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <CompareButton phone={phone} />
                <Link href="/trade-in" className="font-medium text-[#0071e3] hover:underline">
                  🔄 Have an old phone? Trade-in &amp; save
                </Link>
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <DeliveryCheck />
            </div>

            {/* Full Technical Specifications */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900">Technical Specifications</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                {specs.map(([label, value]) => (
                  <div key={label} className="border-b border-gray-100 pb-2">
                    <dt className="text-gray-500 font-medium">{label}</dt>
                    <dd className="font-semibold text-gray-900 mt-0.5">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16">
          <Reviews phoneId={phone.id} rating={phone.rating} />
        </div>

        {/* Related Flagship Phones */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
              More from {phone.brand}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <PhoneCard key={r.id} phone={r} />
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyBuyBar phone={phone} />
    </div>
  );
}
