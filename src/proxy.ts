import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function proxy(req: NextRequest) {
  const existingToken = req.cookies.get(CSRF_COOKIE)?.value;

  if (req.nextUrl.pathname.startsWith("/api/") && MUTATING_METHODS.has(req.method)) {
    const headerToken = req.headers.get(CSRF_HEADER);
    if (!existingToken || !headerToken || headerToken !== existingToken) {
      return NextResponse.json({ error: "Invalid or missing CSRF token" }, { status: 403 });
    }
  }

  const res = NextResponse.next();
  if (!existingToken) {
    res.cookies.set(CSRF_COOKIE, crypto.randomUUID(), {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
