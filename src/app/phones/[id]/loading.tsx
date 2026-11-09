export default function Loading() {
  return (
    <div className="section">
      <div className="container-narrow">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-3xl bg-[#f0f0f2]" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-20 animate-pulse rounded bg-[#f0f0f2]" />
            <div className="h-10 w-64 animate-pulse rounded bg-[#f0f0f2]" />
            <div className="h-6 w-32 animate-pulse rounded bg-[#f0f0f2]" />
            <div className="h-24 w-full animate-pulse rounded bg-[#f0f0f2]" />
            <div className="h-12 w-full animate-pulse rounded-full bg-[#f0f0f2]" />
          </div>
        </div>
      </div>
    </div>
  );
}
