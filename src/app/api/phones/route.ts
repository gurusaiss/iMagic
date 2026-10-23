import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { phonePlaceholder } from "@/lib/placeholder";
import { getSessionUser } from "@/lib/auth";

type PhoneBody = {
  brand: string;
  model: string;
  price: number;
  mrp: number;
  ram_gb: number;
  storage_gb: number;
  display: string;
  battery_mah: number;
  camera: string;
  processor: string;
  color: string;
  description: string;
  stock: number;
};

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = (await req.json()) as PhoneBody;

  const image = phonePlaceholder(`${body.brand} ${body.model}`, "#1f2937", "#2563eb");

  const info = db
    .prepare(
      `INSERT INTO phones (brand, model, price, mrp, ram_gb, storage_gb, display, battery_mah, camera, processor, color, description, image, rating, stock)
       VALUES (@brand, @model, @price, @mrp, @ram_gb, @storage_gb, @display, @battery_mah, @camera, @processor, @color, @description, @image, 4.0, @stock)`
    )
    .run({ ...body, image });

  return NextResponse.json({ id: info.lastInsertRowid });
}
