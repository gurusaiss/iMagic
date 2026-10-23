"use client";

import Link from "next/link";
import { Phone } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";

export default function PhoneCard({ phone }: { phone: Phone }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const discount = Math.round(((phone.mrp - phone.price) / phone.mrp) * 100);
  const reviewCount = 50 + ((phone.id * 37) % 900);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      phoneId: phone.id,
      name: `${phone.brand} ${phone.model}`,
      image: phone.image,
      price: phone.price,
    });
    showToast(`${phone.model} added to cart`, "success");
  }

  return (
    <Link
      href={`/phones/${phone.id}`}
      className="card-hover group relative flex flex-col overflow-hidden rounded-xl border bg-white"
    >
      {discount > 0 && (
        <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
          {discount}% OFF
        </span>
      )}
      {phone.rating >= 4.5 && (
        <span className="absolute right-2 top-2 z-10 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
          BESTSELLER
        </span>
      )}

      <div className="relative flex items-center justify-center overflow-hidden bg-gray-100 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={phone.image}
          alt={phone.model}
          className="h-40 w-40 object-contain transition-transform duration-300 ease-out group-hover:scale-110"
        />
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-2 right-2 translate-y-10 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gray-700"
        >
          + Quick Add
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          {phone.brand}
        </span>
        <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
          {phone.model}
        </h3>
        <p className="text-xs text-gray-500">
          {phone.ram_gb}GB RAM · {phone.storage_gb}GB Storage
        </p>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-xs font-semibold text-white">
            {phone.rating.toFixed(1)} ★
          </span>
          <span className="text-xs text-gray-500">({reviewCount.toLocaleString("en-IN")})</span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold">{formatINR(phone.price)}</span>
          {discount > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatINR(phone.mrp)}
              </span>
              <span className="text-sm font-semibold text-green-600">{discount}% off</span>
            </>
          )}
        </div>
        {phone.stock <= 8 && (
          <p className="mt-1 text-xs font-semibold text-red-600">Only {phone.stock} left!</p>
        )}
      </div>
    </Link>
  );
}
