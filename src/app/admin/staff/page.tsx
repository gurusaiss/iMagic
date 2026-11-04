import Link from "next/link";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { StaffMember } from "@/lib/types";
import StaffManageClient from "./StaffManageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Delivery Staff" };
export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  await requireAdmin();
  const staff = db.prepare("SELECT * FROM staff_members ORDER BY name").all() as StaffMember[];

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">← Admin Dashboard</Link>
      </div>
      <h1 className="mb-6 text-2xl font-bold">Delivery Staff Management</h1>
      <StaffManageClient staff={staff} />
    </div>
  );
}
