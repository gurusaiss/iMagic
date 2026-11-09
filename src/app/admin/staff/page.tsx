import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { StaffMember } from "@/lib/types";
import StaffManageClient from "@/components/StaffManageClient";

export default async function AdminStaffPage() {
  await requireAdmin();
  const staff = db.prepare("SELECT * FROM staff_members ORDER BY id DESC").all() as StaffMember[];

  return (
    <div className="section">
      <div className="container-narrow max-w-3xl">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Manage staff</h1>
        <StaffManageClient staff={staff} />
      </div>
    </div>
  );
}
