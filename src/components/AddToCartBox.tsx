"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { Phone } from "@/lib/types";

export default function AddToCartBox({ phone }: { phone: Phone }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      { phoneId: phone.id, name: `${phone.brand} ${phone.model}`, image: phone.image, price: phone.price },
      qty
    );
    setAdded(true);
    showToast(`Added ${qty} × ${phone.model} to cart`, "success");
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(
      { phoneId: phone.id, name: `${phone.brand} ${phone.model}`, image: phone.image, price: phone.price },
      qty
    );
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Qty</span>
        <div className="flex items-center rounded-full border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="rounded-l-full px-3 py-1 transition-colors hover:bg-gray-100 active:scale-95"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(phone.stock, q + 1))}
            className="rounded-r-full px-3 py-1 transition-colors hover:bg-gray-100 active:scale-95"
          >
            +
          </button>
        </div>
        <span className="text-xs text-gray-500">{phone.stock} in stock</span>
      </div>
      <div className="flex gap-3">
        <button onClick={handleAdd} className="btn-secondary flex-1">
          {added ? "Added ✓" : "Add to Cart"}
        </button>
        <button onClick={handleBuyNow} className="btn-primary flex-1">
          Buy Now
        </button>
      </div>
    </div>
  );
}
