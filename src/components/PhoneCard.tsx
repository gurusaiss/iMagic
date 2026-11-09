import Link from "next/link";
import Image from "next/image";
import type { Phone } from "@/lib/types";
import WishlistButton from "./WishlistButton";
import CompareButton from "./CompareButton";
import StarRating from "./StarRating";
import ProductBadge from "./ProductBadge";

export default function PhoneCard({ phone }: { phone: Phone }) {
  const outOfStock = phone.stock <= 0;
  const discount = Math.round(((phone.mrp - phone.price) / phone.mrp) * 100);

  return (
    <div className="card relative flex flex-col overflow-hidden p-5">
      <div className="absolute right-4 top-4 z-10">
        <WishlistButton phoneId={phone.id} />
      </div>
      <Link href={`/phones/${phone.id}`} className="flex flex-col gap-4">
        <div className="relative flex h-48 items-center justify-center">
          <Image src={phone.image} alt={`${phone.brand} ${phone.model}`} width={160} height={160} className="object-contain" unoptimized />
          {outOfStock && (
            <span className="pill absolute left-0 top-0 bg-[var(--foreground)] text-white">Out of stock</span>
          )}
          {!outOfStock && <div className="absolute left-0 top-0"><ProductBadge rating={phone.rating} /></div>}
        </div>
        <div>
          <p className="text-xs text-muted">{phone.brand}</p>
          <h3 className="text-base font-semibold">{phone.model}</h3>
          <p className="mt-1 text-xs text-muted">{phone.ram_gb}GB / {phone.storage_gb}GB</p>
          <div className="mt-1 flex items-center gap-1">
            <StarRating rating={phone.rating} size={12} />
            <span className="text-xs text-muted">{phone.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">₹{phone.price.toLocaleString("en-IN")}</span>
          {discount > 0 && (
            <>
              <span className="text-sm text-muted line-through">₹{phone.mrp.toLocaleString("en-IN")}</span>
              <span className="text-xs font-medium text-[var(--success)]">{discount}% off</span>
            </>
          )}
        </div>
      </Link>
      <div className="mt-3">
        <CompareButton phone={phone} />
      </div>
    </div>
  );
}
