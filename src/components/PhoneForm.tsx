"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Phone } from "@/lib/types";
import { useToast } from "@/lib/toast-context";

type FormState = {
  brand: string;
  model: string;
  price: string;
  mrp: string;
  ram_gb: string;
  storage_gb: string;
  display: string;
  battery_mah: string;
  camera: string;
  processor: string;
  color: string;
  description: string;
  stock: string;
};

function toFormState(phone?: Phone): FormState {
  return {
    brand: phone?.brand ?? "",
    model: phone?.model ?? "",
    price: phone ? String(phone.price) : "",
    mrp: phone ? String(phone.mrp) : "",
    ram_gb: phone ? String(phone.ram_gb) : "",
    storage_gb: phone ? String(phone.storage_gb) : "",
    display: phone?.display ?? "",
    battery_mah: phone ? String(phone.battery_mah) : "",
    camera: phone?.camera ?? "",
    processor: phone?.processor ?? "",
    color: phone?.color ?? "",
    description: phone?.description ?? "",
    stock: phone ? String(phone.stock) : "10",
  };
}

export default function PhoneForm({ phone }: { phone?: Phone }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(toFormState(phone));
  const [saving, setSaving] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      ram_gb: Number(form.ram_gb),
      storage_gb: Number(form.storage_gb),
      battery_mah: Number(form.battery_mah),
      stock: Number(form.stock),
    };

    const res = phone
      ? await fetch(`/api/phones/${phone.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/phones`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (res.ok) {
      showToast(phone ? "Phone updated" : "Phone added", "success");
      router.push("/admin");
      router.refresh();
    } else {
      showToast("Failed to save phone", "error");
      setSaving(false);
    }
  }

  const fields: { name: keyof FormState; label: string; type?: string }[] = [
    { name: "brand", label: "Brand" },
    { name: "model", label: "Model" },
    { name: "price", label: "Price (₹)", type: "number" },
    { name: "mrp", label: "MRP (₹)", type: "number" },
    { name: "ram_gb", label: "RAM (GB)", type: "number" },
    { name: "storage_gb", label: "Storage (GB)", type: "number" },
    { name: "display", label: "Display" },
    { name: "battery_mah", label: "Battery (mAh)", type: "number" },
    { name: "camera", label: "Camera" },
    { name: "processor", label: "Processor" },
    { name: "color", label: "Color" },
    { name: "stock", label: "Stock" },
  ];

  const inputClass =
    "w-full rounded-lg border px-3 py-1.5 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-fade-in-up max-w-2xl space-y-4 rounded-xl border bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-sm font-medium">{f.label}</label>
            <input
              name={f.name}
              type={f.type ?? "text"}
              value={form[f.name]}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        ))}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          required
          className={inputClass}
        />
      </div>
      <p className="text-xs text-gray-500">
        A placeholder product image is auto-generated — no image upload needed for this demo.
      </p>
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving..." : phone ? "Save Changes" : "Add Phone"}
      </button>
    </form>
  );
}
