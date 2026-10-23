import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { createSession, hashPassword, isAdminEmail, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password } = (await req.json()) as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json(
      { error: "Please fill in all fields — password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const role = isAdminEmail(email) ? "admin" : "customer";

  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)")
    .run(name, email.toLowerCase(), hashPassword(password), role);

  const token = createSession(info.lastInsertRowid as number);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ role, name });
}
