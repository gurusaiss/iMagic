import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ phoneId: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { phoneId } = await params;
  const phone = db.prepare("SELECT id FROM phones WHERE id = ?").get(phoneId);
  if (!phone) return NextResponse.json({ error: "Phone not found" }, { status: 404 });

  const existing = db
    .prepare("SELECT id FROM wishlist_items WHERE user_id = ? AND phone_id = ?")
    .get(user.id, phoneId);

  if (existing) {
    db.prepare("DELETE FROM wishlist_items WHERE user_id = ? AND phone_id = ?").run(user.id, phoneId);
    return NextResponse.json({ ok: true, added: false });
  }

  db.prepare("INSERT INTO wishlist_items (user_id, phone_id) VALUES (?, ?)").run(user.id, phoneId);
  return NextResponse.json({ ok: true, added: true });
}
