"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useCurrentUser } from "@/lib/use-current-user";
import { formatINR } from "@/lib/format";

export default function Navbar() {
  const { items, count, total, updateQty, removeItem } = useCart();
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        setCartOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 400);
    return () => clearTimeout(t);
  }, [count]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/phones?q=${encodeURIComponent(query)}` : "/phones");
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 text-2xl font-extrabold tracking-tight">
          iMagic
        </Link>

        <form onSubmit={handleSearch} className="hidden flex-1 sm:block">
          <div className="flex overflow-hidden rounded-md bg-white transition-shadow focus-within:ring-2 focus-within:ring-amber-400">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for phones, brands and more"
              className="flex-1 px-4 py-2 text-sm text-gray-900 outline-none"
            />
            <button
              type="submit"
              className="flex items-center bg-amber-400 px-4 text-gray-900 transition-colors hover:bg-amber-500"
              aria-label="Search"
            >
              🔍
            </button>
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-5 text-sm font-medium">
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex flex-col items-start leading-tight transition-opacity hover:opacity-80"
            >
              {loading ? (
                <span>Loading...</span>
              ) : user ? (
                <>
                  <span className="text-xs text-blue-100">Hello, {user.name.split(" ")[0]}</span>
                  <span className="font-semibold">Account &amp; Lists ▾</span>
                </>
              ) : (
                <>
                  <span className="text-xs text-blue-100">Hello, sign in</span>
                  <span className="font-semibold">Account &amp; Lists ▾</span>
                </>
              )}
            </button>

            {menuOpen && (
              <div className="animate-fade-in-up absolute right-0 mt-2 w-56 rounded-md border bg-white py-2 text-gray-800 shadow-xl">
                {user ? (
                  <>
                    <div className="border-b px-4 py-2 text-xs text-gray-500">
                      Signed in as
                      <br />
                      <span className="font-semibold text-gray-900">{user.email}</span>
                    </div>
                    {user.role === "admin" ? (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 transition-colors hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/orders"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2 transition-colors hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-red-600 transition-colors hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 font-semibold text-blue-600 transition-colors hover:bg-gray-50"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            )}
          </div>

          <Link href="/orders" className="hidden flex-col leading-tight transition-opacity hover:opacity-80 md:flex">
            <span className="text-xs text-blue-100">Returns</span>
            <span className="font-semibold">&amp; Orders</span>
          </Link>

          <div ref={cartRef} className="relative">
            <button
              onClick={() => setCartOpen((v) => !v)}
              className="relative flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <span className="text-2xl">🛒</span>
              {count > 0 && (
                <span
                  className={`absolute -top-2 left-4 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-gray-900 ${
                    pulse ? "animate-pulse-once" : ""
                  }`}
                >
                  {count}
                </span>
              )}
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-xs text-blue-100">Cart</span>
                <span className="font-semibold">
                  {items.length > 0 ? formatINR(total) : "Empty"}
                </span>
              </span>
            </button>

            {cartOpen && (
              <div className="animate-fade-in-up absolute right-0 mt-2 w-80 rounded-md border bg-white py-3 text-gray-800 shadow-xl">
                {items.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">
                    Your cart is empty.
                  </div>
                ) : (
                  <>
                    <div className="max-h-72 space-y-3 overflow-y-auto px-4">
                      {items.map((item) => (
                        <div key={item.phoneId} className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 shrink-0 rounded border object-contain"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.qty} × {formatINR(item.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.phoneId)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t px-4 pt-3 text-sm font-semibold">
                      <span>Subtotal</span>
                      <span>{formatINR(total)}</span>
                    </div>
                    <div className="mt-3 flex gap-2 px-4">
                      <Link
                        href="/cart"
                        onClick={() => setCartOpen(false)}
                        className="btn-secondary flex-1 !py-2 text-sm"
                      >
                        View Cart
                      </Link>
                      <Link
                        href="/checkout"
                        onClick={() => setCartOpen(false)}
                        className="btn-primary flex-1 !py-2 text-sm"
                      >
                        Checkout
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="px-4 pb-3 sm:hidden">
        <div className="flex overflow-hidden rounded-md bg-white">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones..."
            className="flex-1 px-4 py-2 text-sm text-gray-900 outline-none"
          />
          <button type="submit" className="bg-amber-400 px-4 text-gray-900">
            🔍
          </button>
        </div>
      </form>

      <nav className="hidden gap-5 overflow-x-auto bg-blue-800/60 px-4 py-2 text-xs font-medium sm:flex">
        <Link href="/phones" className="transition-opacity hover:opacity-80">
          All Phones
        </Link>
        <Link href="/phones?brand=Nexora" className="transition-opacity hover:opacity-80">
          Nexora
        </Link>
        <Link href="/phones?brand=Veltrix" className="transition-opacity hover:opacity-80">
          Veltrix
        </Link>
        <Link href="/phones?brand=Orova" className="transition-opacity hover:opacity-80">
          Orova
        </Link>
        <Link href="/phones?sort=price_asc" className="transition-opacity hover:opacity-80">
          Deals Under ₹15,000
        </Link>
        <Link href="/phones?sort=newest" className="transition-opacity hover:opacity-80">
          New Arrivals
        </Link>
      </nav>
    </header>
  );
}
