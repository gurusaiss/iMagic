import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import db from "@/lib/db";
import { Phone } from "@/lib/types";
import { formatINR } from "@/lib/format";
import AddToCartBox from "@/components/AddToCartBox";
import ImageGallery from "@/components/ImageGallery";
import CompareButton from "@/components/CompareButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const phone = db.prepare("SELECT * FROM phones WHERE id = ?").get(id) as Phone | undefined;
  if (!phone) return { title: "Phone Not Found" };
  return {
    title: `${phone.brand} ${phone.model}`,
    description: phone.description,
    openGraph: {
      title: `${phone.brand} ${phone.model} — ${formatINR(phone.price)}`,
      description: phone.description,
    },
  };
}

export default async function PhoneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const phone = db.prepare("SELECT * FROM phones WHERE id = ?").get(id) as
    | Phone
    | undefined;

  if (!phone) notFound();

  const discount = Math.round(((phone.mrp - phone.price) / phone.mrp) * 100);
  const reviewCount = 50 + ((phone.id * 37) % 900);

  // Related phones (same brand, different model)
  const related = db
    .prepare("SELECT * FROM phones WHERE brand = ? AND id != ? LIMIT 4")
    .all(phone.brand, phone.id) as Phone[];

  const specs: [string, string][] = [
    ["Display", phone.display],
    ["Processor", phone.processor],
    ["RAM", `${phone.ram_gb} GB`],
    ["Storage", `${phone.storage_gb} GB`],
    ["Battery", `${phone.battery_mah} mAh`],
    ["Camera", phone.camera],
    ["Color", phone.color],
  ];

  const highlights = [
    `${phone.display}`,
    `${phone.processor} for smooth everyday performance`,
    `${phone.camera} camera system`,
    `${phone.battery_mah} mAh battery with all-day backup`,
  ];

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return (
    <div className="animate-fade-in mx-auto max-w-6xl px-4 py-6">
      <nav className="mb-4 text-xs text-gray-500">
        <Link href="/" className="hover:underline">Home</Link>{" "}
        /{" "}
        <Link href="/phones" className="hover:underline">Phones</Link>{" "}
        /{" "}
        <Link href={`/phones?brand=${phone.brand}`} className="hover:underline">
          {phone.brand}
        </Link>{" "}
        / <span className="text-gray-700">{phone.model}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr_320px]">
        {/* Image gallery */}
        <ImageGallery image={phone.image} alt={phone.model} />

        {/* Details */}
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {phone.brand}
          </span>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{phone.model}</h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-green-600 px-2 py-0.5 text-sm font-semibold text-white">
              {phone.rating.toFixed(1)} ★
            </span>
            <span className="text-sm text-gray-500">
              {reviewCount.toLocaleString("en-IN")} ratings
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">{formatINR(phone.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatINR(phone.mrp)}
                </span>
                <span className="font-semibold text-green-600">{discount}% off</span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Inclusive of all taxes</p>

          <div className="mt-4">
            <CompareButton phoneId={phone.id} phoneName={phone.model} size="md" />
          </div>

          <div className="mt-5">
            <h2 className="mb-2 text-sm font-semibold">Highlights</h2>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
              {highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-sm text-gray-700">{phone.description}</p>

          <div className="mt-6 rounded-xl border bg-white p-5">
            <h2 className="mb-3 font-semibold">Specifications</h2>
            <dl className="grid grid-cols-1 gap-y-2 text-sm sm:grid-cols-2">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between border-b pb-1 sm:block sm:border-0">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Sticky buy box */}
        <div className="h-fit rounded-xl border bg-white p-5 shadow-sm md:sticky md:top-24">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{formatINR(phone.price)}</span>
            {discount > 0 && (
              <span className="text-sm font-semibold text-green-600">{discount}% off</span>
            )}
          </div>
          <p className="mt-1 text-sm text-green-700">
            {phone.stock > 0 ? `In stock (${phone.stock} units)` : "Out of stock"}
          </p>
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>
              📦 Delivery by{" "}
              <span className="font-medium text-gray-900">
                {deliveryDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </p>
            <p>↩️ 7 day replacement available</p>
            <p>🔒 Secure payment — UPI, Cards, Net Banking, EMI</p>
          </div>
          <div className="mt-5">
            <AddToCartBox phone={phone} />
          </div>
        </div>
      </div>

      {/* Related phones */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">More from {phone.brand}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((r) => {
              const rDiscount = Math.round(((r.mrp - r.price) / r.mrp) * 100);
              return (
                <Link
                  key={r.id}
                  href={`/phones/${r.id}`}
                  className="card-hover group flex flex-col overflow-hidden rounded-xl border bg-white"
                >
                  <div className="flex items-center justify-center bg-gray-100 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={r.model}
                      className="h-24 w-24 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3 text-sm">
                    <p className="font-medium text-gray-900">{r.model}</p>
                    <p className="mt-1 font-bold">{formatINR(r.price)}</p>
                    {rDiscount > 0 && (
                      <p className="text-xs text-green-600">{rDiscount}% off</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
