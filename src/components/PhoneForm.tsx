"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { phonePlaceholder } from "@/lib/placeholder";
import type { Phone } from "@/lib/types";

type FormState = {
  brand: string;
  model: string;
  price: number;
  mrp: number;
  ram_gb: number;
  storage_gb: number;
  display: string;
  battery_mah: number;
  camera: string;
  processor: string;
  color: string;
  description: string;
  stock: number;
};

const EMPTY: FormState = {
  brand: "",
  model: "",
  price: 0,
  mrp: 0,
  ram_gb: 4,
  storage_gb: 64,
  display: "",
  battery_mah: 4000,
  camera: "",
  processor: "",
  color: "",
  description: "",
  stock: 10,
};

export default function PhoneForm({ phone }: { phone?: Phone }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(
    phone
      ? {
          brand: phone.brand,
          model: phone.model,
          price: phone.price,
          mrp: phone.mrp,
          ram_gb: phone.ram_gb,
          storage_gb: phone.storage_gb,
          display: phone.display,
          battery_mah: phone.battery_mah,
          camera: phone.camera,
          processor: phone.processor,
          color: phone.color,
          description: phone.description,
          stock: phone.stock,
        }
      : EMPTY
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const image = phone?.image ?? phonePlaceholder(`${form.brand} ${form.model}`, "#1d1d1f", "#424245");
    const url = phone ? `/api/phones/${phone.id}` : "/api/phones";
    const method = phone ? "PUT" : "POST";

    const res = await apiFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image }),
    });

    setSaving(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to save phone");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-6">
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Brand">
          <input required value={form.brand} onChange={(e) => update("brand", e.target.value)} className="input" />
        </Field>
        <Field label="Model">
          <input required value={form.model} onChange={(e) => update("model", e.target.value)} className="input" />
        </Field>
        <Field label="Price (₹)">
          <input required type="number" min={0} value={form.price} onChange={(e) => update("price", Number(e.target.value))} className="input" />
        </Field>
        <Field label="MRP (₹)">
          <input required type="number" min={0} value={form.mrp} onChange={(e) => update("mrp", Number(e.target.value))} className="input" />
        </Field>
        <Field label="RAM (GB)">
          <input required type="number" min={0} value={form.ram_gb} onChange={(e) => update("ram_gb", Number(e.target.value))} className="input" />
        </Field>
        <Field label="Storage (GB)">
          <input required type="number" min={0} value={form.storage_gb} onChange={(e) => update("storage_gb", Number(e.target.value))} className="input" />
        </Field>
        <Field label="Display">
          <input required value={form.display} onChange={(e) => update("display", e.target.value)} className="input" />
        </Field>
        <Field label="Battery (mAh)">
          <input required type="number" min={0} value={form.battery_mah} onChange={(e) => update("battery_mah", Number(e.target.value))} className="input" />
        </Field>
        <Field label="Camera">
          <input required value={form.camera} onChange={(e) => update("camera", e.target.value)} className="input" />
        </Field>
        <Field label="Processor">
          <input required value={form.processor} onChange={(e) => update("processor", e.target.value)} className="input" />
        </Field>
        <Field label="Color">
          <input required value={form.color} onChange={(e) => update("color", e.target.value)} className="input" />
        </Field>
        <Field label="Stock">
          <input required type="number" min={0} value={form.stock} onChange={(e) => update("stock", Number(e.target.value))} className="input" />
        </Field>
      </div>
      <Field label="Description">
        <textarea required rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className="input" />
      </Field>
      <button type="submit" disabled={saving} className="btn-primary self-start">
        {saving ? "Saving..." : phone ? "Update Phone" : "Add Phone"}
      </button>
      <style jsx>{`
        .input {
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          width: 100%;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}
