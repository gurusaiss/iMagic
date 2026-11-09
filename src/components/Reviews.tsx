import { getReviewsForPhone } from "@/lib/reviews";
import StarRating from "./StarRating";

export default function Reviews({ phoneId, rating }: { phoneId: number; rating: number }) {
  const reviews = getReviewsForPhone(phoneId, rating);
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="border-t border-[var(--border)] pt-10">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">Customer reviews</h2>
        <StarRating rating={avg} size={18} />
        <span className="text-sm text-muted">{avg.toFixed(1)} out of 5 ({reviews.length} reviews)</span>
      </div>
      <div className="flex flex-col gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="card p-5">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <StarRating rating={r.rating} />
                {r.verified && <span className="pill bg-[#e6f6ea] text-[var(--success)] text-[10px]">Verified Purchase</span>}
              </div>
              <span className="text-xs text-muted">{r.date}</span>
            </div>
            <h3 className="mb-1 font-medium">{r.title}</h3>
            <p className="text-sm text-muted">{r.comment}</p>
            <p className="mt-3 text-xs font-medium">{r.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
