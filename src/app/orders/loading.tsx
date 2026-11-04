export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      <div className="animate-shimmer h-8 w-40 rounded" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-white p-5 space-y-3">
          <div className="flex justify-between">
            <div className="animate-shimmer h-4 w-24 rounded" />
            <div className="animate-shimmer h-4 w-20 rounded" />
          </div>
          <div className="animate-shimmer h-3 w-48 rounded" />
          <div className="animate-shimmer h-3 w-32 rounded" />
        </div>
      ))}
    </div>
  );
}
