import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) destroySessionToken(token);
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
