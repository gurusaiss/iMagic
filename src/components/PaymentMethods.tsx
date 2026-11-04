"use client";

import { useState } from "react";

export type PaymentMethod = "upi" | "card" | "netbanking" | "emi";

type Props = {
  total: number;
  onConfirm: (method: PaymentMethod, detail: string) => void;
  onBack: () => void;
  paying: boolean;
};

const UPI_APPS = ["Google Pay", "PhonePe", "Paytm", "BHIM"];
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank"];
const EMI_PLANS = [
  { months: 3, label: "3 months", extra: 0 },
  { months: 6, label: "6 months", extra: 1.5 },
  { months: 12, label: "12 months", extra: 3 },
  { months: 24, label: "24 months", extra: 6 },
];

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function PaymentMethods({ total, onConfirm, onBack, paying }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState(UPI_APPS[0]);
  const [upiMode, setUpiMode] = useState<"vpa" | "app">("app");
  const [bank, setBank] = useState(BANKS[0]);
  const [emiMonths, setEmiMonths] = useState(3);
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  function handlePay() {
    let detail = "";
    if (method === "upi") detail = upiMode === "app" ? upiApp : upiId;
    else if (method === "card") detail = `Card ending ${cardNum.slice(-4)}`;
    else if (method === "netbanking") detail = bank;
    else if (method === "emi") detail = `EMI ${emiMonths}m via card`;
    onConfirm(method, detail);
  }

  const tab =
    "flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-150 text-center cursor-pointer select-none";
  const activeTab = tab + " border-blue-500 bg-blue-50 text-blue-700";
  const inactiveTab = tab + " border-gray-200 bg-white text-gray-600 hover:border-gray-300";
  const input =
    "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const emiPlan = EMI_PLANS.find((p) => p.months === emiMonths)!;
  const emiTotal = total * (1 + emiPlan.extra / 100);
  const emiPerMonth = Math.ceil(emiTotal / emiMonths);

  return (
    <div className="animate-fade-in-up space-y-5">
      <h2 className="font-semibold">Payment Method</h2>

      {/* Method tabs */}
      <div className="flex gap-2">
        {(["upi", "card", "netbanking", "emi"] as PaymentMethod[]).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={method === m ? activeTab : inactiveTab}
          >
            {m === "upi" && "📲 UPI"}
            {m === "card" && "💳 Card"}
            {m === "netbanking" && "🏦 Net Banking"}
            {m === "emi" && "📅 EMI"}
          </button>
        ))}
      </div>

      {/* UPI */}
      {method === "upi" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setUpiMode("app")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${upiMode === "app" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}
            >
              UPI App
            </button>
            <button
              onClick={() => setUpiMode("vpa")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${upiMode === "vpa" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}
            >
              UPI ID / VPA
            </button>
          </div>
          {upiMode === "app" ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {UPI_APPS.map((app) => (
                <button
                  key={app}
                  onClick={() => setUpiApp(app)}
                  className={`rounded-xl border p-3 text-sm font-medium transition-all ${upiApp === app ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300"}`}
                >
                  {app}
                </button>
              ))}
            </div>
          ) : (
            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className={input}
            />
          )}
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
            🔔 Simulated payment — you will not be charged. Click Pay to place the order instantly.
          </p>
        </div>
      )}

      {/* Card */}
      {method === "card" && (
        <div className="space-y-3">
          <input
            value={cardNum}
            onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16))}
            placeholder="Card Number (16 digits)"
            className={input}
            maxLength={16}
          />
          <input
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Name on Card"
            className={input}
          />
          <div className="flex gap-3">
            <input
              value={cardExp}
              onChange={(e) => setCardExp(e.target.value)}
              placeholder="MM / YY"
              className={input}
              maxLength={5}
            />
            <input
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="CVV"
              className={input}
              maxLength={4}
              type="password"
            />
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
            🔔 Demo only — no real card is charged.
          </p>
        </div>
      )}

      {/* Net Banking */}
      {method === "netbanking" && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Select your bank</label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BANKS.map((b) => (
              <button
                key={b}
                onClick={() => setBank(b)}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${bank === b ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300"}`}
              >
                🏦 {b}
              </button>
            ))}
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
            🔔 Simulated — you will be redirected in a real integration.
          </p>
        </div>
      )}

      {/* EMI */}
      {method === "emi" && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Select EMI Plan</label>
          <div className="grid grid-cols-2 gap-2">
            {EMI_PLANS.map((plan) => (
              <button
                key={plan.months}
                onClick={() => setEmiMonths(plan.months)}
                className={`rounded-xl border p-4 text-left transition-all ${emiMonths === plan.months ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <p className="font-semibold text-sm">{plan.label}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatINR(Math.ceil(total * (1 + plan.extra / 100) / plan.months))}/mo
                </p>
                {plan.extra > 0 && (
                  <p className="text-xs text-orange-600">{plan.extra}% interest</p>
                )}
                {plan.extra === 0 && (
                  <p className="text-xs text-green-600 font-semibold">No cost EMI</p>
                )}
              </button>
            ))}
          </div>
          <div className="rounded-lg bg-gray-50 border p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Monthly payment</span>
              <span className="font-semibold">{formatINR(emiPerMonth)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-gray-500">Total payable</span>
              <span className="font-semibold">{formatINR(Math.ceil(emiTotal))}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="btn-secondary flex-1"
          disabled={paying}
        >
          ← Back
        </button>
        <button
          onClick={handlePay}
          disabled={paying}
          className="btn-primary flex-1"
        >
          {paying ? "Processing…" : `Pay ${formatINR(total)}`}
        </button>
      </div>
    </div>
  );
}
