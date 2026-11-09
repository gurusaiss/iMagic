"use client";

import Link from "next/link";
import Image from "next/image";
import type { Phone } from "@/lib/types";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import StarRating from "./StarRating";
import ProductBadge from "./ProductBadge";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

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

export default function PhoneCard({ phone }: { phone: Phone }) {
  const { add } = useCart();
  const { show } = useToast();
  const outOfStock = phone.stock <= 0;
  const discount = Math.round(((phone.mrp - phone.price) / phone.mrp) * 100);
  const emiPerMonth = Math.round(phone.price / 12);
  const swatchColor = COLOR_SWATCHES[phone.color] ?? "#334155";

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    add(phone, 1);
    show(`${phone.model} added to bag!`, "success");
  }

  function formatINR(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gray-300 hover:shadow-xl">
      {/* Top Badges & Wishlist */}
      <div className="flex items-center justify-between gap-2 z-10">
        <div>
          {outOfStock ? (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
              Out of stock
            </span>
          ) : (
            <ProductBadge rating={phone.rating} />
          )}
        </div>
        <div className="rounded-full bg-white/90 p-0.5 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform">
          <WishlistButton phoneId={phone.id} />
        </div>
      </div>

      {/* Product Image Stage */}
      <Link href={`/phones/${phone.id}`} className="block relative my-3 flex h-52 w-full items-center justify-center">
        <div className="transition-transform duration-300 ease-out group-hover:scale-105">
          <Image
            src={phone.image}
            alt={`${phone.brand} ${phone.model}`}
            width={180}
            height={220}
            className="h-48 w-auto object-contain drop-shadow-md"
            unoptimized
          />
        </div>
      </Link>

      {/* Color Swatch Dot */}
      <div className="mb-2 flex items-center justify-center gap-1.5">
        <span
          className="h-3 w-3 rounded-full border border-gray-300 shadow-inner"
          style={{ backgroundColor: swatchColor }}
          title={phone.color}
        />
        <span className="text-[11px] text-gray-500 font-medium">{phone.color}</span>
      </div>

      {/* Title & Specs */}
      <Link href={`/phones/${phone.id}`} className="block">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-[#0071e3]">
          {phone.brand}
        </p>
        <h3 className="mt-0.5 text-base font-bold text-gray-900 group-hover:text-[#0071e3] transition-colors truncate">
          {phone.model}
        </h3>
        <p className="mt-1 text-xs text-gray-500 truncate">
          {phone.ram_gb}GB RAM · {phone.storage_gb}GB · {phone.camera}
        </p>

        {/* Star Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <StarRating rating={phone.rating} size={13} />
          <span className="text-xs font-semibold text-gray-800">{phone.rating.toFixed(1)}</span>
          <span className="text-[11px] text-gray-400">({50 + ((phone.id * 37) % 900)})</span>
        </div>

        {/* Pricing Block */}
        <div className="mt-3 border-t border-gray-100 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">{formatINR(phone.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through">{formatINR(phone.mrp)}</span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          <p className="mt-0.5 text-[11px] font-medium text-gray-500">
            or <span className="font-semibold text-gray-800">{formatINR(emiPerMonth)}/mo</span> with No Cost EMI
          </p>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center gap-2 pt-2 border-t border-gray-100">
        <Link
          href={`/phones/${phone.id}`}
          className="flex-1 rounded-full bg-[#0071e3] py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-[#0077ed] transition-colors"
        >
          Buy Now
        </Link>
        <button
          onClick={handleQuickAdd}
          disabled={outOfStock}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-[#f5f5f7] text-gray-700 hover:bg-gray-200 hover:border-gray-300 transition-colors disabled:opacity-40"
          title="Add to Cart"
          aria-label="Add to Cart"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Compare Checkbox */}
      <div className="mt-2 text-center">
        <CompareButton phone={phone} />
      </div>
    </div>
  );
}
