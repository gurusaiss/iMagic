"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { useCurrentUser } from "@/lib/user-context";

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useCurrentUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await apiFetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Signup failed");
      return;
    }
    await refresh();
    router.push("/phones");
  }

  return (
    <div className="section flex justify-center">
      <div className="card w-full max-w-sm p-8">
        <h1 className="mb-6 text-2xl font-semibold">Create account</h1>
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-[var(--danger)]">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            maxLength={80}
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
          />
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
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account? <Link href="/login" className="text-[var(--accent)]">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
