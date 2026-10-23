import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
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

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/phones/[id]">
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const body = (await req.json()) as PhoneBody;

  db.prepare(
    `UPDATE phones SET brand=@brand, model=@model, price=@price, mrp=@mrp, ram_gb=@ram_gb,
     storage_gb=@storage_gb, display=@display, battery_mah=@battery_mah, camera=@camera,
     processor=@processor, color=@color, description=@description, stock=@stock
     WHERE id=@id`
  ).run({ ...body, id });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/phones/[id]">
) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { id } = await ctx.params;
  db.prepare("DELETE FROM phones WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
