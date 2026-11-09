"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const { items, remove, setQty, totalPrice, totalSavings, loaded } = useCart();

  if (loaded && items.length === 0) {
    return <EmptyState title="Your cart is empty." action="Browse phones" actionHref="/phones" />;
  }

  return (
    <div className="section">
      <div className="container-narrow grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>
          {items.map((item) => (
            <div key={item.id} className="card flex items-center gap-4 p-4">
              <Image src={item.image} alt={item.model} width={64} height={64} className="object-contain" unoptimized />
              <div className="flex-1">
                <p className="font-medium">{item.brand} {item.model}</p>
                <p className="text-sm text-muted">₹{item.price.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty(item.id, item.qty - 1)} className="h-8 w-8 rounded-full border border-[var(--border)]">
                  −
                </button>
                <span className="w-6 text-center">{item.qty}</span>
                <button onClick={() => setQty(item.id, item.qty + 1)} className="h-8 w-8 rounded-full border border-[var(--border)]">
                  +
                </button>
              </div>
              <button onClick={() => remove(item.id)} className="text-sm text-[var(--danger)]">
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="card h-fit p-6">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          {totalSavings > 0 && (
            <div className="mt-2 flex justify-between text-sm text-[var(--success)]">
              <span>Your savings</span>
              <span>−₹{totalSavings.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-[var(--border)] pt-4 font-semibold">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
