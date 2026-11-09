import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import type { Phone } from "@/lib/types";
import AddToCartBox from "@/components/AddToCartBox";
import WishlistButton from "@/components/WishlistButton";
import CompareButton from "@/components/CompareButton";
import PhoneCard from "@/components/PhoneCard";
import StarRating from "@/components/StarRating";
import Reviews from "@/components/Reviews";
import DeliveryCheck from "@/components/DeliveryCheck";
import StickyBuyBar from "@/components/StickyBuyBar";
import ProductBadge from "@/components/ProductBadge";

export default async function PhoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const phone = db.prepare("SELECT * FROM phones WHERE id = ?").get(id) as Phone | undefined;
  if (!phone) notFound();

  const related = db
    .prepare("SELECT * FROM phones WHERE brand = ? AND id != ? LIMIT 4")
    .all(phone.brand, phone.id) as Phone[];

  const specs = [
    ["Display", phone.display],
    ["Processor", phone.processor],
    ["RAM", `${phone.ram_gb} GB`],
    ["Storage", `${phone.storage_gb} GB`],
    ["Battery", `${phone.battery_mah} mAh`],
    ["Camera", phone.camera],
    ["Color", phone.color],
  ];

  const discount = Math.round(((phone.mrp - phone.price) / phone.mrp) * 100);

  const highlights = [
    `${phone.display}`,
    `${phone.ram_gb}GB RAM, ${phone.storage_gb}GB Storage`,
    `${phone.camera} camera system`,
    `${phone.battery_mah}mAh battery`,
    `${phone.processor}`,
  ];

  return (
    <div className="section pb-24 md:pb-16">
      <div className="container-narrow">
        <nav className="mb-8 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
          <span>/</span>
          <Link href="/phones" className="hover:text-[var(--foreground)]">Phones</Link>
          <span>/</span>
          <Link href={`/phones?brand=${phone.brand}`} className="hover:text-[var(--foreground)]">{phone.brand}</Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{phone.model}</span>
        </nav>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="relative flex items-center justify-center rounded-3xl bg-[#f5f5f7] p-12">
            <div className="absolute right-6 top-6">
              <WishlistButton phoneId={phone.id} />
            </div>
            <Image src={phone.image} alt={`${phone.brand} ${phone.model}`} width={280} height={280} className="object-contain" unoptimized />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-sm text-muted">{phone.brand}</p>
              <h1 className="text-4xl font-semibold tracking-tight">{phone.model}</h1>
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={phone.rating} />
                <span className="text-sm text-muted">{phone.rating.toFixed(1)}</span>
                <ProductBadge rating={phone.rating} />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">₹{phone.price.toLocaleString("en-IN")}</span>
              <span className="text-base text-muted line-through">₹{phone.mrp.toLocaleString("en-IN")}</span>
              {discount > 0 && <span className="text-sm font-medium text-[var(--success)]">{discount}% off</span>}
            </div>
            <ul className="flex flex-col gap-1.5 text-sm text-muted">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--muted)]" />
                  {h}
                </li>
              ))}
            </ul>
            <p className="text-muted">{phone.description}</p>
            <p className="text-xs text-muted">
              Or pay ₹{Math.round(phone.price / 12).toLocaleString("en-IN")}/mo for 12 months with No Cost EMI.{" "}
              <Link href="/faq" className="text-[var(--accent)]">Learn more</Link>
            </p>
            <AddToCartBox phone={phone} />
            <CompareButton phone={phone} />
            <DeliveryCheck />
            <div className="border-t border-[var(--border)] pt-6">
              <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                {specs.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="text-muted">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Reviews phoneId={phone.id} rating={phone.rating} />
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight">More from {phone.brand}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <PhoneCard key={r.id} phone={r} />
              ))}
            </div>
          </div>
        )}
      </div>
      <StickyBuyBar phone={phone} />
    </div>
  );
}
