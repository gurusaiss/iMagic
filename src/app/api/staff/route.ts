import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const staff = db.prepare("SELECT * FROM staff_members ORDER BY id DESC").all();
  return NextResponse.json({ staff });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const area = String(body.area ?? "").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  const info = db
    .prepare("INSERT INTO staff_members (name, phone, area) VALUES (?, ?, ?)")
    .run(name, phone, area);

  return NextResponse.json({ id: info.lastInsertRowid });
}
