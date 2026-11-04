import { MetadataRoute } from "next";
import db from "@/lib/db";
import { Phone } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://imagic.vercel.app";
  const phones = db.prepare("SELECT id FROM phones").all() as Pick<Phone, "id">[];

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/phones`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/compare`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/login`, changeFrequency: "monthly", priority: 0.3 },
    ...phones.map((p) => ({
      url: `${base}/phones/${p.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
