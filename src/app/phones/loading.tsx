function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white">
      <div className="animate-shimmer h-48 w-full" />
      <div className="p-4 space-y-2">
        <div className="animate-shimmer h-3 w-16 rounded" />
        <div className="animate-shimmer h-4 w-32 rounded" />
        <div className="animate-shimmer h-3 w-24 rounded" />
        <div className="animate-shimmer h-5 w-20 rounded mt-2" />
      </div>
    </div>
  );
}

export default function PhonesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="animate-shimmer mb-6 h-8 w-32 rounded" />
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-56 space-y-3">
          <div className="animate-shimmer h-5 w-24 rounded" />
          <div className="animate-shimmer h-32 w-full rounded-xl" />
          <div className="animate-shimmer h-5 w-24 rounded" />
          <div className="animate-shimmer h-20 w-full rounded-xl" />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}
