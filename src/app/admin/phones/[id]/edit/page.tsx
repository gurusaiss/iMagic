import { notFound } from "next/navigation";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import type { Phone } from "@/lib/types";
import PhoneForm from "@/components/PhoneForm";

export default async function EditPhonePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const phone = db.prepare("SELECT * FROM phones WHERE id = ?").get(id) as Phone | undefined;
  if (!phone) notFound();

  return (
    <div className="section">
      <div className="container-narrow max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Edit phone</h1>
        <PhoneForm phone={phone} />
      </div>
    </div>
  );
}
