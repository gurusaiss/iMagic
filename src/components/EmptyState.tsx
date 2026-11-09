import Link from "next/link";

export default function EmptyState({
  title,
  action,
  actionHref,
}: {
  title: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-lg text-muted">{title}</p>
      {action && actionHref && (
        <Link href={actionHref} className="btn-primary inline-flex">
          {action}
        </Link>
      )}
    </div>
  );
}
