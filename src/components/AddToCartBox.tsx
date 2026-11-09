"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import type { Phone } from "@/lib/types";

export default function AddToCartBox({ phone }: { phone: Phone }) {
  const { add } = useCart();
  const { show } = useToast();
  const [qty, setQty] = useState(1);
  const outOfStock = phone.stock <= 0;

  return (
    <div className="flex flex-col gap-4">
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-full border border-[var(--border)]"
          >
            −
          </button>
          <span className="w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(phone.stock, q + 1))}
            className="h-9 w-9 rounded-full border border-[var(--border)]"
          >
            +
          </button>
        </div>
      )}
      <button
        disabled={outOfStock}
        onClick={() => {
          add(phone, qty);
          show(`${phone.brand} ${phone.model} added to cart`);
        }}
        className="btn-primary w-full"
      >
        {outOfStock ? "Out of stock" : "Add to Cart"}
      </button>
    </div>
  );
}
