import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createSession, hashPassword, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";
import { isRateLimited, clientKey } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  if (isRateLimited(clientKey(req, "signup"))) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!name || name.length > 80 || /[<>]/.test(name)) {
    return NextResponse.json({ error: "Please enter a valid name" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')")
    .run(name, email, hashPassword(password));

  const token = createSession(Number(info.lastInsertRowid));
  const res = NextResponse.json({
    user: { id: info.lastInsertRowid, name, email, role: "customer" },
  });
  res.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}
