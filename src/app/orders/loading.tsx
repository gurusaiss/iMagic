export default function Loading() {
  return (
    <div className="section">
      <div className="container-narrow">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-[#f0f0f2]" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card h-20 animate-pulse bg-[#f0f0f2]" />
          ))}
        </div>
      </div>
    </div>
  );
}
