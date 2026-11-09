export default function ProductBadge({ rating }: { rating: number }) {
  if (rating >= 4.5) {
    return <span className="pill bg-[#fff4e5] text-[#b45309] text-[10px] font-semibold">Bestseller</span>;
  }
  if (rating >= 4.0) {
    return <span className="pill bg-[#e5f0ff] text-[#0071e3] text-[10px] font-semibold">iMagic Assured</span>;
  }
  return null;
}
