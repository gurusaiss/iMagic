"use client";

import { useWishlist } from "@/lib/wishlist-context";
import { useCurrentUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";

export default function WishlistButton({
  phoneId,
  variant = "floating",
}: {
  phoneId: number;
  variant?: "floating" | "inline";
}) {
  const { ids, toggle } = useWishlist();
  const { user } = useCurrentUser();
  const router = useRouter();
  const active = ids.has(phoneId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    toggle(phoneId);
  }

  if (variant === "inline") {
    return (
      <button onClick={handleClick} className="btn-secondary w-full text-sm">
        {active ? "♥ Saved" : "♡ Save for later"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Toggle wishlist"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur hover:scale-105 transition-transform"
    >
      <span className={active ? "text-[var(--danger)]" : "text-[var(--muted)]"}>{active ? "♥" : "♡"}</span>
    </button>
  );
}
