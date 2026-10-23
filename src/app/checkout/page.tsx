"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useCurrentUser } from "@/lib/use-current-user";
import { formatINR } from "@/lib/format";

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

  useEffect(() => {
    if (user) setForm((f) => (f.customerName ? f : { ...f, customerName: user.name }));
  }, [user]);

  if (!userLoading && !user) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Please log in to check out</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your cart is saved — log in or create an account to continue.
        </p>
        <Link href="/login" className="btn-primary mt-6">
          Login / Sign Up
        </Link>
      </div>
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerName || !form.addressLine || !form.city || !form.pincode) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStep("payment");
  }

  async function handlePayNow() {
    setPaying(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
        }),
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
    "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="animate-fade-in mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">Checkout</h1>

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <span
          className={`flex items-center gap-2 font-semibold ${
            step === "address" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              step === "address" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </span>
          Address
        </span>
        <span className="h-px w-10 bg-gray-300" />
        <span
          className={`flex items-center gap-2 font-semibold ${
            step === "payment" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              step === "payment" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </span>
          Payment
        </span>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 rounded-xl border bg-white p-6 shadow-sm">
          {step === "address" ? (
            <form
              onSubmit={handleAddressSubmit}
              className="animate-fade-in-up space-y-4"
            >
              <h2 className="font-semibold">Delivery Address</h2>
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name *</label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Address *</label>
                <textarea
                  name="addressLine"
                  value={form.addressLine}
                  onChange={handleChange}
                  className={inputClass}
                  rows={3}
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">City *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">Pincode *</label>
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="animate-fade-in-up rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              <button type="submit" className="btn-dark w-full">
                Continue to Payment
              </button>
            </form>
          ) : (
            <div className="animate-fade-in-up space-y-4">
              <h2 className="font-semibold">Payment</h2>
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                This is a simulated payment step for the demo — no real payment gateway is
                connected. Clicking &quot;Pay Now&quot; immediately marks the order as paid.
              </p>
              <div className="rounded-lg border p-4 text-sm text-gray-600">
                <p>Delivering to:</p>
                <p className="font-medium text-gray-900">{form.customerName}</p>
                <p>{form.addressLine}</p>
                <p>
                  {form.city} - {form.pincode}
                </p>
              </div>
              {error && (
                <p className="animate-fade-in-up rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}
              <button onClick={handlePayNow} disabled={paying} className="btn-primary w-full">
                {paying ? "Processing..." : `Pay Now — ${formatINR(total)}`}
              </button>
              <button
                onClick={() => setStep("address")}
                className="w-full text-sm text-gray-500 transition-colors hover:text-gray-800 hover:underline"
              >
                Back to address
              </button>
            </div>
          )}
        </div>

        <div className="h-fit w-full rounded-xl border bg-white p-5 shadow-sm md:w-72">
          <h2 className="mb-3 font-semibold">Order Summary</h2>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.phoneId} className="flex justify-between">
                <span className="text-gray-600">
                  {i.name} × {i.qty}
                </span>
                <span>{formatINR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t pt-2 font-semibold">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
