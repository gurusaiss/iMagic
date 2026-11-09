"use client";

import { useWishlist } from "@/lib/wishlist-context";
import PhoneCard from "@/components/PhoneCard";
import EmptyState from "@/components/EmptyState";

export default function WishlistPage() {
  const { phones, loaded } = useWishlist();

  if (loaded && phones.length === 0) {
    return <EmptyState title="Your wishlist is empty." action="Browse phones" actionHref="/phones" />;
  }

  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight">Wishlist</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {phones.map((p) => (
            <PhoneCard key={p.id} phone={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
