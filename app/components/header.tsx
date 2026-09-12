"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  UserRound,
  X,
  ShoppingBag,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useState } from "react";

import ProductSearch from "./ProductSearch";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Image from "next/image";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/warranty-policy", label: "Warranty" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/about", label: "About" },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  if (href === "/buy") {
    return pathname === "/buy";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LogoMark() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Main Logo Image Container - Constrained height to prevent overflow */}
      <div className="relative flex h-14 w-auto shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo-img.png"
          // src="/final-logo.png"
          alt="Phone Bhai"
          width={140}
          height={28}
          priority
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Stylish Tagline Directly Under Logo */}
      <div className="py- 2 flex  gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 border-width-4 ">
        <span className="transition-colors duration-300 group-hover:text-cyan-500">
          Phones
        </span>
        <span className="h-0.5 w-0.5 rounded-full bg-indigo-500/40" />
        <span className="transition-colors duration-300 group-hover:text-indigo-600">
          Accessories
        </span>
        <span className="h-0.5 w-0.5 rounded-full bg-indigo-500/40" />
        <span className="transition-colors duration-300 group-hover:text-violet-600">
          More
        </span>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
      {/* VIBRANT TOP GRADIENT BORDER */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-violet-600" />

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* BRAND LOGO WITH TAGLINE */}
        <Link
          href="/"
          className="group flex items-center focus:outline-none"
          aria-label="PhoneBhai Home"
          onClick={closeMobileMenu}
        >
          <LogoMark />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center rounded-full border border-gray-200/70 bg-gray-50/70 p-1 shadow-sm backdrop-blur-md lg:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative overflow-hidden rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  active
                    ? "bg-white text-indigo-700 shadow-[0_3px_12px_rgba(79,70,229,0.12)]"
                    : "text-gray-600 hover:-translate-y-0.5 hover:bg-white hover:text-gray-950 hover:shadow-[0_5px_16px_rgba(15,23,42,0.08)]"
                }`}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span
                  className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 transition-all duration-300 ${
                    active
                      ? "w-5 opacity-100"
                      : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-100"
                  }`}
                />
                <span className="relative z-10 transition-all duration-300 group-hover:tracking-wide">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <ProductSearch />
          <div className="h-5 w-px bg-gray-200" />
          
          <Link
            href="/wishlist"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
            className={`group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
              pathname === "/wishlist"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-transparent hover:text-indigo-600 hover:drop-shadow-[0_0_6px_rgba(79,70,229,0.45)]"
            }`}
          >
            <Heart
              size={18}
              className="transition-all duration-300 group-hover:scale-110 group-hover:text-red-600"
            />
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            className={`group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
              pathname === "/cart"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-transparent hover:text-indigo-600 hover:drop-shadow-[0_0_6px_rgba(79,70,229,0.45)]"
            }`}
          >
            <ShoppingBag
              size={18}
              className="transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-600"
            />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/account"
            className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
              pathname === "/account" || pathname.startsWith("/account/")
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-transparent hover:bg-gradient-to-r hover:from-indigo-50 hover:via-violet-50 hover:to-indigo-50 hover:text-indigo-700 hover:shadow-[0_4px_16px_rgba(79,70,229,0.12)]"
            }`}
          >
            <UserRound
              size={15}
              className="transition-all duration-300 group-hover:scale-110"
            />
            <span>Account</span>
          </Link>

          <Link
            href="/warranty-policy"
            className={`group flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
              isActiveRoute(pathname, "/warranty-policy")
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-gray-50 text-gray-700 hover:border-transparent hover:bg-gradient-to-r hover:from-indigo-50 hover:via-violet-50 hover:to-indigo-50 hover:text-indigo-700 hover:shadow-[0_4px_16px_rgba(79,70,229,0.12)]"
            }`}
          >
            <ShieldCheck
              size={15}
              className="text-indigo-600 transition-all duration-300 group-hover:scale-110"
            />
            <span>Warranty</span>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 lg:hidden"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-100 bg-white lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-4 py-4"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const active = isActiveRoute(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    )}
                  </Link>
                );
              })}

              <div className="mt-2 border-t border-gray-100 pt-3">
                <ProductSearch />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border py-2 text-xs font-semibold transition ${
                    pathname === "/wishlist"
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="relative">
                    <Heart size={16} />
                    {wishlistCount > 0 && (
                      <span className="absolute -right-2 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[8px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span>Wishlist</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeMobileMenu}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border py-2 text-xs font-semibold transition ${
                    pathname === "/cart"
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="relative">
                    <ShoppingBag size={16} />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[8px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>

                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border py-2 text-xs font-semibold transition ${
                    pathname === "/account" || pathname.startsWith("/account/")
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <UserRound size={16} />
                  <span>Account</span>
                </Link>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/warranty-policy"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-800 transition hover:bg-gray-100"
                >
                  <ShieldCheck size={15} className="text-indigo-600" />
                  <span>Warranty</span>
                </Link>
                <Link
                  href="/privacy-policy"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-xs font-bold text-gray-800 transition hover:bg-gray-100"
                >
                  <Lock size={15} className="text-indigo-600" />
                  <span>Privacy</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}