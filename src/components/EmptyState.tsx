import Link from "next/link";

export default function EmptyState({
  title,
  description,
  action,
  actionHref,
}: {
  title: string;
  description?: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-2xl text-zinc-400">
        
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">{title}</h2>
      {description && <p className="max-w-md text-sm text-[#86868b]">{description}</p>}
      {action && actionHref && (
        <Link href={actionHref} className="btn-primary mt-2 inline-flex">
          {action}
        </Link>
      )}
    </div>
  );
}
