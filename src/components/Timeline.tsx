import { ORDER_STATUS_FLOW, STATUS_LABELS } from "@/lib/types";

export default function Timeline({ status }: { status: string }) {
  const terminal = status === "CANCELLED";
  const idx = ORDER_STATUS_FLOW.indexOf(status as (typeof ORDER_STATUS_FLOW)[number]);
  const activeIdx = idx === -1 ? ORDER_STATUS_FLOW.length - 1 : idx;

  if (terminal) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--danger)]">
        This order was cancelled.
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {ORDER_STATUS_FLOW.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                i <= activeIdx ? "bg-[var(--accent)] text-white" : "bg-[#f5f5f7] text-muted"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs text-muted">{STATUS_LABELS[step]}</span>
          </div>
          {i < ORDER_STATUS_FLOW.length - 1 && (
            <div className={`mx-2 h-px flex-1 ${i < activeIdx ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
          )}
        </div>
      ))}
      {(status === "RETURN_REQUESTED" || status === "REFUNDED") && (
        <div className="ml-4 pill bg-[#fff4e5] text-[#b45309]">{STATUS_LABELS[status]}</div>
      )}
    </div>
  );
}
