"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import type { Phone } from "@/lib/types";

export default function AdminPhonesTable({ phones }: { phones: Phone[] }) {
  const router = useRouter();

  async function handleDelete(id: number) {
    if (!confirm("Delete this phone?")) return;
    const res = await apiFetch(`/api/phones/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-left text-muted">
            <th className="p-4">Phone</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stock</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {phones.map((p) => (
            <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
              <td className="p-4 font-medium">{p.brand} {p.model}</td>
              <td className="p-4">₹{p.price.toLocaleString("en-IN")}</td>
              <td className="p-4">{p.stock}</td>
              <td className="flex gap-3 p-4">
                <Link href={`/admin/phones/${p.id}/edit`} className="text-[var(--accent)]">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p.id)} className="text-[var(--danger)]">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
