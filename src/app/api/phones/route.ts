import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { validatePhoneInput } from "@/lib/validate-phone";
import { phonePlaceholder } from "@/lib/placeholder";

export async function GET() {
  const phones = db.prepare("SELECT * FROM phones ORDER BY id DESC").all();
  return NextResponse.json({ phones });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const error = validatePhoneInput(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const image =
    typeof body.image === "string" && body.image
      ? body.image
      : phonePlaceholder(`${body.brand} ${body.model}`, body.color || "Midnight Black");

  const info = db
    .prepare(
      `INSERT INTO phones (brand, model, price, mrp, ram_gb, storage_gb, display, battery_mah, camera, processor, color, description, image, stock)
       VALUES (@brand, @model, @price, @mrp, @ram_gb, @storage_gb, @display, @battery_mah, @camera, @processor, @color, @description, @image, @stock)`
    )
    .run({ ...body, image });

  return NextResponse.json({ id: info.lastInsertRowid });
}
