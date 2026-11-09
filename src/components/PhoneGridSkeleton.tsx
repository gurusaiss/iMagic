export default function PhoneGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card flex flex-col gap-4 p-5">
          <div className="h-48 animate-pulse rounded-xl bg-[#f0f0f2]" />
          <div className="h-3 w-16 animate-pulse rounded bg-[#f0f0f2]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[#f0f0f2]" />
          <div className="h-4 w-20 animate-pulse rounded bg-[#f0f0f2]" />
        </div>
      ))}
    </div>
  );
}
