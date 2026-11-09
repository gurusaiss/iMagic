import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const phones = db
    .prepare(
      `SELECT phones.* FROM wishlist_items
       JOIN phones ON phones.id = wishlist_items.phone_id
       WHERE wishlist_items.user_id = ?
       ORDER BY wishlist_items.created_at DESC`
    )
    .all(user.id);

  return NextResponse.json({ phones });
}
