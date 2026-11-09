import { requireAdmin } from "@/lib/auth";
import PhoneForm from "@/components/PhoneForm";

export default async function NewPhonePage() {
  await requireAdmin();
  return (
    <div className="section">
      <div className="container-narrow max-w-2xl">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Add phone</h1>
        <PhoneForm />
      </div>
    </div>
  );
}
