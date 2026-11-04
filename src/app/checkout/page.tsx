"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useCurrentUser } from "@/lib/use-current-user";
import { formatINR } from "@/lib/format";
import PaymentMethods, { PaymentMethod } from "@/components/PaymentMethods";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, loading: userLoading } = useCurrentUser();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    pincode: "",
  });
  const [step, setStep] = useState<"address" | "payment">("address");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0 && !paying) router.replace("/cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (!userLoading && !user) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-5xl">🔐</p>
        <h1 className="mt-4 text-xl font-bold">Please log in to check out</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your cart is saved — log in or create an account to continue.
        </p>
        <Link href="/login" className="btn-primary mt-6">
          Login / Sign Up
        </Link>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    const customerName = form.customerName || user?.name || "";
    if (!customerName || !form.addressLine || !form.city || !form.pincode) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.pincode.length !== 6 || !/^\d+$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setError("");
    setStep("payment");
  }

  async function handlePayNow(method: PaymentMethod, detail: string) {
    setPaying(true);
    try {
      const customerName = form.customerName || user?.name || "";
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, customerName, items, paymentMethod: method, paymentDetail: detail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setPaying(false);
        return;
      }
      clearCart();
      router.push(`/order/${data.orderId}/confirmation`);
    } catch {
      setError("Network error — please try again.");
      setPaying(false);
    }
  }

  if (items.length === 0) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const stepDot = (n: number, label: string, active: boolean, done: boolean) => (
    <span className={`flex items-center gap-2 font-semibold ${active ? "text-blue-600" : done ? "text-green-600" : "text-gray-400"}`}>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-blue-600 text-white" : done ? "bg-green-500 text-white" : "bg-gray-200"}`}>
        {done ? "✓" : n}
      </span>
      {label}
    </span>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Checkout</h1>

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        {stepDot(1, "Address", step === "address", step === "payment")}
        <span className="h-px w-10 bg-gray-300" />
        {stepDot(2, "Payment", step === "payment", false)}
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Main panel */}
        <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
          {step === "address" ? (
            <form onSubmit={handleAddressSubmit} className="animate-fade-in-up space-y-4">
              <h2 className="font-semibold">Delivery Address</h2>
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name *</label>
                <input name="customerName" value={form.customerName !== "" ? form.customerName : (user?.name ?? "")} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone Number</label>
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className={inputClass} type="tel" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Address *</label>
                <textarea name="addressLine" value={form.addressLine} onChange={handleChange} className={inputClass} rows={3} required />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} className={inputClass} required />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">Pincode *</label>
                  <input name="pincode" value={form.pincode} onChange={handleChange} className={inputClass} maxLength={6} required />
                </div>
              </div>
              {error && (
                <p className="animate-fade-in-up rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              <button type="submit" className="btn-dark w-full">
                Continue to Payment →
              </button>
            </form>
          ) : (
            <>
              {/* Address summary */}
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
                <p className="font-medium text-green-800">📍 Delivering to:</p>
                <p className="mt-1 text-gray-700">{form.customerName || user?.name} · {form.addressLine}, {form.city} – {form.pincode}</p>
              </div>
              {error && (
                <p className="mb-4 animate-fade-in-up rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}
              <PaymentMethods
                total={total}
                onConfirm={handlePayNow}
                onBack={() => setStep("address")}
                paying={paying}
              />
            </>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="h-fit w-full rounded-xl border bg-white p-5 shadow-sm md:w-72">
          <h2 className="mb-3 font-semibold">Order Summary</h2>
          <ul className="space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.phoneId} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt={i.name} className="h-10 w-10 shrink-0 rounded border object-contain" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-gray-700">{i.name}</p>
                  <p className="text-xs text-gray-500">Qty: {i.qty}</p>
                </div>
                <span className="font-medium">{formatINR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span><span>{formatINR(total)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span><span className="text-green-600 font-medium">FREE</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-1 border-t">
              <span>Total</span><span>{formatINR(total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">🔒 Secure & encrypted payment</p>
        </div>
      </div>
    </div>
  );
}
