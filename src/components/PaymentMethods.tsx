"use client";

import { useState } from "react";

type Props = {
  value: string;
  onChange: (method: string, detail: string) => void;
};

const TABS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Card" },
  { id: "netbanking", label: "Net Banking" },
  { id: "emi", label: "EMI" },
];

export default function PaymentMethods({ value, onChange }: Props) {
  const [tab, setTab] = useState(value || "upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [bank, setBank] = useState("");

  function selectTab(id: string) {
    setTab(id);
    onChange(id, "");
  }

  function updateDetail(detail: string) {
    if (tab === "card") {
      const last4 = detail.replace(/\s/g, "").slice(-4);
      onChange(tab, last4);
    } else {
      onChange(tab, detail);
    }
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex gap-2 border-b border-[var(--border)] pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => selectTab(t.id)}
            className={`pill ${tab === t.id ? "bg-[var(--foreground)] text-white" : "bg-[#f5f5f7] text-[var(--foreground)]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "upi" && (
        <input
          placeholder="yourname@upi"
          value={upiId}
          onChange={(e) => {
            setUpiId(e.target.value);
            updateDetail(e.target.value);
          }}
          className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
        />
      )}

      {tab === "card" && (
        <input
          placeholder="Card number"
          maxLength={19}
          value={cardNumber}
          onChange={(e) => {
            setCardNumber(e.target.value);
            updateDetail(e.target.value);
          }}
          className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
        />
      )}

      {tab === "netbanking" && (
        <select
          value={bank}
          onChange={(e) => {
            setBank(e.target.value);
            updateDetail(e.target.value);
          }}
          className="w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
        >
          <option value="">Select bank</option>
          <option value="HDFC">HDFC Bank</option>
          <option value="ICICI">ICICI Bank</option>
          <option value="SBI">State Bank of India</option>
          <option value="AXIS">Axis Bank</option>
        </select>
      )}

      {tab === "emi" && (
        <p className="text-sm text-muted">No-cost EMI available on select cards at checkout confirmation.</p>
      )}
    </div>
  );
}
