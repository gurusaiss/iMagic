"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useCurrentUser } from "@/lib/user-context";
import { useEffect } from "react";
import { apiFetch } from "@/lib/api-fetch";
import PaymentMethods from "@/components/PaymentMethods";
import EmptyState from "@/components/EmptyState";

const PINCODE_RE = /^\d{6}$/;
const PHONE_RE = /^\d{10}$/;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalSavings, clear } = useCart();
  const { user } = useCurrentUser();
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentDetail, setPaymentDetail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill name from async user session
      setCustomerName(user.name);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!PINCODE_RE.test(pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }
    if (phoneNumber && !PHONE_RE.test(phoneNumber)) {
      setError("Phone number must be 10 digits");
      return;
    }

    setLoading(true);
    const res = await apiFetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phoneNumber,
        addressLine,
        city,
        pincode,
        paymentMethod,
        paymentDetail,
        idempotencyKey,
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to place order");
      return;
    }

    clear();
    router.push(`/orders/${data.order.id}`);
  }

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty." action="Browse phones" actionHref="/phones" />;
  }

  return (
    <div className="section">
      <div className="container-narrow grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:col-span-2">
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
          {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-[var(--danger)]">{error}</p>}
          <div className="card flex flex-col gap-4 p-6">
            <input required placeholder="Full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            <input placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            <input required placeholder="Address" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
              <input required placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            </div>
          </div>
          <PaymentMethods
            value={paymentMethod}
            onChange={(method, detail) => {
              setPaymentMethod(method);
              setPaymentDetail(detail);
            }}
          />
          <button type="submit" disabled={loading} className="btn-primary self-start">
            {loading ? "Placing order..." : `Pay ₹${totalPrice.toLocaleString("en-IN")}`}
          </button>
        </form>
        <div className="card h-fit p-6">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span>{item.model} × {item.qty}</span>
              <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
            </div>
          ))}
          {totalSavings > 0 && (
            <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2 text-sm text-[var(--success)]">
              <span>Your savings</span>
              <span>−₹{totalSavings.toLocaleString("en-IN")}</span>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-[var(--border)] pt-4 font-semibold">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
