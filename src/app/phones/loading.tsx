import PhoneGridSkeleton from "@/components/PhoneGridSkeleton";

export default function Loading() {
  return (
    <div className="section">
      <div className="container-narrow">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-[#f0f0f2]" />
        <PhoneGridSkeleton />
      </div>
    </div>
  );
}
