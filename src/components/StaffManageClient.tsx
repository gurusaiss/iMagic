"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import type { StaffMember } from "@/lib/types";

export default function StaffManageClient({ staff }: { staff: StaffMember[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await apiFetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, area }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to add staff");
      return;
    }
    setName("");
    setPhone("");
    setArea("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAdd} className="card flex flex-wrap items-end gap-3 p-5">
        {error && <p className="w-full text-sm text-[var(--danger)]">{error}</p>}
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Name</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Phone</span>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted">Area</span>
          <input value={area} onChange={(e) => setArea(e.target.value)} className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
        </label>
        <button type="submit" className="btn-primary">
          Add Staff
        </button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-muted">
              <th className="p-4">Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Area</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-b border-[var(--border)] last:border-0">
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.phone}</td>
                <td className="p-4">{s.area || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
