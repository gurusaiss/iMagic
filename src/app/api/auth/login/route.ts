import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createSession, verifyPassword, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";
import { isRateLimited, clientKey } from "@/lib/rate-limit";

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "customer";
};

export async function POST(req: Request) {
  if (isRateLimited(clientKey(req, "login"))) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = createSession(user.id);
  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}
