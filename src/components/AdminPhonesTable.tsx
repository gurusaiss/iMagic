"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Phone } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { useToast } from "@/lib/toast-context";

export default function AdminPhonesTable({ phones }: { phones: Phone[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number, model: string) {
    if (!confirm(`Delete "${model}"? This can't be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/phones/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) {
      showToast(`${model} deleted`, "success");
      router.refresh();
    } else {
      showToast("Failed to delete phone", "error");
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Brand</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {phones.map((p) => (
            <tr key={p.id} className="border-t transition-colors hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{p.model}</td>
              <td className="px-4 py-3">{p.brand}</td>
              <td className="px-4 py-3">{formatINR(p.price)}</td>
              <td className="px-4 py-3">
                <span className={p.stock <= 8 ? "font-semibold text-red-600" : ""}>
                  {p.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/phones/${p.id}/edit`}
                  className="mr-3 text-blue-600 transition-colors hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.model)}
                  disabled={deletingId === p.id}
                  className="text-red-600 transition-colors hover:underline disabled:opacity-60"
                >
                  {deletingId === p.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
