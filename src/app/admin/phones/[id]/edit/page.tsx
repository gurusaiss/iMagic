import { notFound } from "next/navigation";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Phone } from "@/lib/types";
import PhoneForm from "@/components/PhoneForm";

export const dynamic = "force-dynamic";

export default async function EditPhonePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const phone = db.prepare("SELECT * FROM phones WHERE id = ?").get(id) as
    | Phone
    | undefined;

  if (!phone) notFound();

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Edit {phone.brand} {phone.model}
      </h1>
      <PhoneForm phone={phone} />
    </div>
  );
}
