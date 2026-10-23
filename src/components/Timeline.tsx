import { ORDER_STATUS_FLOW, OrderStatus, STATUS_LABELS } from "@/lib/types";

export default function Timeline({ status }: { status: OrderStatus }) {
  const isReturnFlow = status === "RETURN_REQUESTED" || status === "REFUNDED";
  const currentIndex = isReturnFlow
    ? ORDER_STATUS_FLOW.length - 1
    : ORDER_STATUS_FLOW.indexOf(status as (typeof ORDER_STATUS_FLOW)[number]);

  return (
    <div>
      <div className="flex items-center">
        {ORDER_STATUS_FLOW.map((s, idx) => {
          const done = idx <= currentIndex;
          const isCurrent = idx === currentIndex && !isReturnFlow;
          return (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
                    done ? "scale-100 bg-blue-600 text-white" : "scale-90 bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
                >
                  {done ? "✓" : idx + 1}
                </div>
                <span
                  className={`mt-1 w-20 text-center text-xs transition-colors duration-500 ${
                    done ? "font-medium text-gray-900" : "text-gray-400"
                  }`}
                >
                  {STATUS_LABELS[s]}
                </span>
              </div>
              {idx < ORDER_STATUS_FLOW.length - 1 && (
                <div className="mx-1 h-1 flex-1 overflow-hidden rounded bg-gray-200">
                  <div
                    className="h-full rounded bg-blue-600 transition-all duration-700 ease-out"
                    style={{ width: idx < currentIndex ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {isReturnFlow && (
        <div className="animate-fade-in-up mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
          {status === "RETURN_REQUESTED"
            ? "Return requested — our team will contact you about pickup and refund."
            : "Refund processed (simulated)."}
        </div>
      )}
    </div>
  );
}
