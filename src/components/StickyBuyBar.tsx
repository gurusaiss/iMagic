"use client";

import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import type { Phone } from "@/lib/types";

export default function StickyBuyBar({ phone }: { phone: Phone }) {
  const { add } = useCart();
  const { show } = useToast();
  const outOfStock = phone.stock <= 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[var(--border)] bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
      <div>
        <p className="text-sm font-semibold">₹{phone.price.toLocaleString("en-IN")}</p>
        <p className="text-xs text-muted">{phone.brand} {phone.model}</p>
      </div>
      <button
        disabled={outOfStock}
        onClick={() => {
          add(phone, 1);
          show(`${phone.brand} ${phone.model} added to cart`);
        }}
        className="btn-primary px-6 py-2 text-sm"
      >
        {outOfStock ? "Out of stock" : "Add to Cart"}
      </button>
    </div>
  );
}
