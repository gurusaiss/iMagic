import PhoneForm from "@/components/PhoneForm";
import { requireAdmin } from "@/lib/auth";

export default async function NewPhonePage() {
  await requireAdmin();
  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Add New Phone</h1>
      <PhoneForm />
    </div>
  );
}
