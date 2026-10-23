"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { formatINR } from "@/lib/format";

export default function CartPage() {
  const { items, updateQty, removeItem, total } = useCart();
  const { showToast } = useToast();

  function handleRemove(phoneId: number, name: string) {
    removeItem(phoneId);
    showToast(`Removed ${name} from cart`, "info");
  }

  if (items.length === 0) {
    return (
      <div className="animate-fade-in mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mb-4 text-6xl">🛒</div>
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Browse our phones and add something you like.</p>
        <Link href="/phones" className="btn-primary mt-6">
          Shop phones
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your Cart ({items.length})</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.phoneId}
              className="animate-fade-in-up flex items-center gap-4 rounded-xl border bg-white p-4 transition-shadow hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.name} className="h-20 w-20 object-contain" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">{formatINR(item.price)}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border">
                    <button
                      onClick={() => updateQty(item.phoneId, item.qty - 1)}
                      className="rounded-l-full px-2.5 py-0.5 transition-colors hover:bg-gray-100 active:scale-95"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.phoneId, item.qty + 1)}
                      className="rounded-r-full px-2.5 py-0.5 transition-colors hover:bg-gray-100 active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.phoneId, item.name)}
                    className="text-sm text-red-600 transition-colors hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="font-semibold">{formatINR(item.price * item.qty)}</p>
            </div>
          ))}
        </div>

        <div className="h-fit w-full rounded-xl border bg-white p-5 shadow-sm md:w-72">
          <h2 className="mb-3 font-semibold">Order Summary</h2>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatINR(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-4 w-full">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
