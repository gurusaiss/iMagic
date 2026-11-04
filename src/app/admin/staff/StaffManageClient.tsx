"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StaffMember } from "@/lib/types";
import { useToast } from "@/lib/toast-context";

export default function StaffManageClient({ staff }: { staff: StaffMember[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [adding, setAdding] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setAdding(true);
    const res = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, area }),
    });
    setAdding(false);
    if (res.ok) {
      showToast(`${name} added to delivery staff`, "success");
      setName(""); setPhone(""); setArea("");
      router.refresh();
    } else {
      showToast("Failed to add staff member", "error");
    }
  }

  const input = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-8">
      {/* Add staff form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Add Delivery Staff Member</h2>
        <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Full Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={input} required placeholder="e.g. Ravi Kumar" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number *</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={input} required placeholder="10-digit mobile" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Delivery Area</label>
            <input value={area} onChange={(e) => setArea(e.target.value)} className={input} placeholder="e.g. North Zone" />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" disabled={adding} className="btn-primary">
              {adding ? "Adding…" : "+ Add Staff Member"}
            </button>
          </div>
        </form>
      </div>

      {/* Staff list */}
      <div className="rounded-xl border bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">No staff members yet.</td></tr>
            )}
            {staff.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3">{s.phone}</td>
                <td className="px-4 py-3">{s.area || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(s.created_at).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
