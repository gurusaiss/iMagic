import type { MetadataRoute } from "next";
import db from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const phones = db.prepare("SELECT id FROM phones").all() as { id: number }[];
  const base = "https://imagic.example.com";

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/phones`, lastModified: new Date() },
    ...phones.map((p) => ({ url: `${base}/phones/${p.id}`, lastModified: new Date() })),
  ];
}
