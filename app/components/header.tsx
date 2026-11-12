"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const NAV_ITEMS = [
  { href: "/buy", label: "Buy", hasDropdown: true },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blogs" },
  { href: "/wishlist", label: "Wishlist", isWishlist: true },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <>
      {/* ========== DESKTOP + MOBILE TOP HEADER ========== */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              PhoneBhai
            </span>
          </Link>

          {/* DESKTOP CENTER NAV */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActiveRoute(pathname, item.href);

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setBuyOpen(true)}
                    onMouseLeave={() => setBuyOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "text-indigo-600"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={14} className="opacity-60" />
                    </Link>

                    {buyOpen && (
                      <div className="absolute left-0 top-full z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
                        <Link
                          href="/buy"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          All Phones
                        </Link>
                        <Link
                          href="/buy?condition=LIKE_NEW"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Like New
                        </Link>
                        <Link
                          href="/buy?condition=EXCELLENT"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Excellent
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "text-indigo-600"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                  {item.isWishlist && (
                    <Heart
                      size={15}
                      className={
                        wishlistCount > 0
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }
                    />
                  )}
                  {item.isWishlist && wishlistCount > 0 && (
                    <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                      {wishlistCount > 99 ? "99+" : wishlistCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ICONS (Desktop + Mobile) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Cart */}
            <Link
              href="/cart"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-50 hover:text-indigo-600"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              href="/account"
              aria-label="Account"
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-50 hover:text-indigo-600"
            >
              <UserRound size={20} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </header>

      {/* ========== MOBILE BOTTOM TAB BAR ========== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
              pathname === "/"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          {/* Buy */}
          <Link
            href="/buy"
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
              pathname.startsWith("/buy")
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <ShoppingBag size={22} strokeWidth={1.8} />
            <span className="text-[10px] font-medium">Buy</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
              pathname === "/wishlist"
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <div className="relative">
              <Heart
                size={22}
                strokeWidth={1.8}
                className={
                  wishlistCount > 0 ? "fill-red-500 text-red-500" : ""
                }
              />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Wishlist</span>
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 ${
              pathname.startsWith("/account")
                ? "text-indigo-600"
                : "text-gray-500"
            }`}
          >
            <UserRound size={22} strokeWidth={1.8} />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </>
  );
}