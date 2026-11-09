import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { validatePhoneInput } from "@/lib/validate-phone";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const phone = db.prepare("SELECT * FROM phones WHERE id = ?").get(id);
  if (!phone) return NextResponse.json({ error: "Phone not found" }, { status: 404 });
  return NextResponse.json({ phone });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const error = validatePhoneInput(body);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const existing = db.prepare("SELECT image FROM phones WHERE id = ?").get(id) as { image: string } | undefined;
  if (!existing) return NextResponse.json({ error: "Phone not found" }, { status: 404 });

  const image = typeof body.image === "string" && body.image ? body.image : existing.image;

  const info = db
    .prepare(
      `UPDATE phones SET brand=@brand, model=@model, price=@price, mrp=@mrp, ram_gb=@ram_gb,
       storage_gb=@storage_gb, display=@display, battery_mah=@battery_mah, camera=@camera,
       processor=@processor, color=@color, description=@description, image=@image, stock=@stock
       WHERE id=@id`
    )
    .run({ ...body, image, id });

  if (info.changes === 0) return NextResponse.json({ error: "Phone not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const info = db.prepare("DELETE FROM phones WHERE id = ?").run(id);
  if (info.changes === 0) return NextResponse.json({ error: "Phone not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
