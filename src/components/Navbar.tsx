"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { useCurrentUser } from "@/lib/user-context";
import { useWishlist } from "@/lib/wishlist-context";

const CATEGORY_LINKS = [
  { href: "/phones", label: "Shop" },
  { href: "/compare", label: "Compare" },
  { href: "/orders", label: "Orders" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useCurrentUser();
  const { phones: wishlistPhones } = useWishlist();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    router.push("/");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
      <nav className="container-narrow flex h-14 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          iMagic
        </Link>

        <div className="hidden items-center gap-8 text-sm md:flex">
          {CATEGORY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-[var(--foreground)] hover:text-[var(--accent)]">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div
              onClick={() => searchInputRef.current?.focus()}
              className={`flex items-center gap-2 rounded-full border border-[var(--border)] bg-[#f5f5f7] transition-all duration-300 ease-out ${
                searchOpen || query ? "w-56 px-3 py-1.5" : "h-9 w-9 cursor-pointer justify-center"
              }`}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className="shrink-0 text-muted">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setSearchOpen(false)}
                placeholder="Search iMagic"
                className={`bg-transparent text-sm outline-none transition-all duration-300 ease-out ${
                  searchOpen || query ? "w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </div>
          </form>
          <Link href="/wishlist" className="relative text-sm hover:text-[var(--accent)]">
            Wishlist
            {wishlistPhones.length > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--foreground)] text-[10px] text-white">
                {wishlistPhones.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative text-sm hover:text-[var(--accent)]">
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="text-sm hover:text-[var(--accent)]">
                {user.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-xs">
              Sign in
            </Link>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <path d="M0 1H20M0 7H20M0 13H20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[var(--border)] bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search iMagic"
                className="w-full rounded-full border border-[var(--border)] bg-[#f5f5f7] px-4 py-2 text-sm"
              />
            </form>
            {CATEGORY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href="/wishlist" onClick={() => setMenuOpen(false)}>
              Wishlist ({wishlistPhones.length})
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)}>
              Cart ({totalItems})
            </Link>
            {user ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)}>
                  Account
                </Link>
                <button onClick={handleLogout} className="text-left text-[var(--muted)]">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
