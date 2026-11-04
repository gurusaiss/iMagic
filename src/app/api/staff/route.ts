import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { StaffMember } from "@/lib/types";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const staff = db.prepare("SELECT * FROM staff_members ORDER BY name").all() as StaffMember[];
  return NextResponse.json({ staff });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const { name, phone, area } = (await req.json()) as { name: string; phone: string; area: string };
  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }
  const info = db
    .prepare("INSERT INTO staff_members (name, phone, area) VALUES (@name, @phone, @area)")
    .run({ name: name.trim(), phone: phone.trim(), area: (area ?? "").trim() });
  return NextResponse.json({ id: info.lastInsertRowid });
}
