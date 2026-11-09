"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useCurrentUser } from "@/lib/user-context";
import { useWishlist } from "@/lib/wishlist-context";

const NAV_LINKS = [
  { href: "/phones", label: "All Phones" },
  { href: "/phones?brand=Nexora", label: "Nexora" },
  { href: "/phones?brand=Veltrix", label: "Veltrix" },
  { href: "/phones?brand=Orova", label: "Orova" },
  { href: "/compare", label: "Compare" },
  { href: "/trade-in", label: "Trade-In" },
  { href: "/stores", label: "Stores" },
];

export default function Navbar() {
  const { totalItems, totalPrice } = useCart();
  const { user, logout } = useCurrentUser();
  const { phones: wishlistPhones } = useWishlist();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    setUserDropdownOpen(false);
    router.push("/");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  function formatINR(n: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* 1. Aptronix / Imagine Style Top Announcement Bar */}
      <div className="bg-[#161617] px-4 py-2 text-xs font-medium text-gray-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">
               Authorised Reseller
            </span>
            <span className="hidden sm:inline text-gray-400">|</span>
            <span className="hidden sm:inline text-gray-300">
              100% Genuine Products · Official Warranty
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-amber-300 font-medium">
            <span>✨ Festive Offer: Get up to ₹5,000 Instant Cashback on HDFC &amp; ICICI Cards</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <Link href="/stores" className="hover:text-white transition-colors">
              📍 Find a Store
            </Link>
            <span>|</span>
            <Link href="/orders" className="hover:text-white transition-colors">
              🚚 Track Order
            </Link>
            <span className="hidden sm:inline">|</span>
            <a href="tel:1800-462442" className="hidden sm:inline hover:text-white transition-colors">
              📞 1800-IMAGIC
            </a>
          </div>
        </div>
      </div>

      {/* 2. Apple-Style Frosted Translucent Navbar */}
      <nav className="border-b border-gray-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#0071e3] transition-colors">
                iMagic
              </span>
              <span className="hidden md:inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-[#0071e3] border border-blue-200/60">
                Premium Reseller
              </span>
            </Link>
          </div>

          {/* Desktop Category Navigation */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-tight text-gray-700">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#0071e3] transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-[#0071e3] after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Icons & Search */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-44 lg:w-56">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phones, specs..."
                className="w-full rounded-full border border-gray-200 bg-[#f5f5f7] py-1.5 pl-9 pr-3 text-xs text-gray-900 placeholder-gray-500 outline-none transition-all focus:border-[#0071e3] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                className="absolute left-3 top-2.5 text-gray-400"
              >
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </form>

            {/* Wishlist Button */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {wishlistPhones.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {wishlistPhones.length}
                </span>
              )}
            </Link>

            {/* Cart Bag */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-full bg-[#f5f5f7] px-3 py-1.5 text-gray-800 hover:bg-gray-200 transition-colors"
              title="Cart"
              aria-label="Shopping Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xs font-semibold">{totalItems}</span>
              {totalPrice > 0 && (
                <span className="hidden sm:inline text-xs font-semibold text-[#0071e3]">
                  · {formatINR(totalPrice)}
                </span>
              )}
            </Link>

            {/* Account / User Dropdown */}
            <div ref={dropdownRef} className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:border-gray-300 transition-all"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0071e3] text-[10px] font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </span>
                  <span className="max-w-[70px] truncate">{user.name.split(" ")[0]}</span>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-gray-400">
                    <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary !px-4 !py-1.5 !text-xs !font-semibold"
                >
                  Sign In
                </Link>
              )}

              {/* Dropdown Menu */}
              {user && userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-2 text-xs shadow-2xl z-50">
                  <div className="border-b border-gray-100 px-3 py-2">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="truncate text-gray-500 text-[11px]">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    👤 My Account
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    📦 My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ❤️ Saved Phones
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 font-medium text-[#0071e3] hover:bg-blue-50 transition-colors"
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-gray-900"
              aria-label="Toggle navigation"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search phones, specs..."
                className="w-full rounded-full border border-gray-200 bg-[#f5f5f7] py-2 pl-9 pr-3 text-xs text-gray-900 outline-none"
              />
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="absolute left-3 top-3 text-gray-400">
                <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </form>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-gray-100 bg-[#f5f5f7] p-2.5 text-center text-gray-800 hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Help &amp; Support</Link>
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>FAQs</Link>
              <Link href="/trade-in" onClick={() => setMobileMenuOpen(false)}>Exchange Calculator</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
