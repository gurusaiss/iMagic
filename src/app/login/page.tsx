"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { useCurrentUser } from "@/lib/user-context";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    await refresh();
    router.push(data.user.role === "admin" ? "/admin" : "/phones");
  }

  return (
    <div className="section flex justify-center">
      <div className="card w-full max-w-sm p-8">
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-[var(--danger)]">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          No account? <Link href="/signup" className="text-[var(--accent)]">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
