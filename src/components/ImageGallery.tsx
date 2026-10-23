"use client";

import { useState } from "react";

const VARIANTS = [
  { label: "Front", filter: "none" },
  { label: "Back", filter: "hue-rotate(12deg) saturate(1.1)" },
  { label: "Side", filter: "brightness(1.08) contrast(1.05)" },
];

export default function ImageGallery({ image, alt }: { image: string; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div>
      <div
        className="flex items-center justify-center overflow-hidden rounded-xl border bg-gray-100 p-8"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          style={{ filter: VARIANTS[active].filter }}
          className={`h-72 w-72 cursor-zoom-in object-contain transition-transform duration-300 ease-out ${
            zoomed ? "scale-125" : "scale-100"
          }`}
        />
      </div>
      <div className="mt-3 flex gap-2">
        {VARIANTS.map((v, i) => (
          <button
            key={v.label}
            onClick={() => setActive(i)}
            className={`flex h-16 w-16 items-center justify-center rounded-lg border bg-gray-50 p-1 transition-all duration-150 ${
              i === active
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-400"
            }`}
            aria-label={`Show ${v.label.toLowerCase()} view`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt=""
              style={{ filter: v.filter }}
              className="h-full w-full object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
