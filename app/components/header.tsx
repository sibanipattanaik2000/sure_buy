
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import ProductSearch from "./ProductSearch";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/buy",
    label: "Buy",
  },
  {
    href: "/sell",
    label: "Sell",
  },
  {
    href: "/about",
    label: "About",
  },
];

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
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
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* LOGO */}

        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="PhoneBhai Home"
          onClick={closeMobileMenu}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm transition duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Zap size={18} strokeWidth={2.5} />
          </div>

          <div className="leading-none">
            <span className="text-[21px] font-black tracking-[-0.04em] text-gray-950">
              Phone
            </span>

            <span className="text-[21px] font-black tracking-[-0.04em] text-indigo-600">
              Bhai
            </span>

            <p className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.18em] text-gray-400 sm:block">
              Smart Tech Marketplace
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(pathname, item.href);

            return (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={active}
              />
            );
          })}
        </nav>

        {/* DESKTOP ACTIONS */}

        <div className="hidden items-center gap-2 lg:flex">
          {/* SEARCH */}

          <ProductSearch />

          {/* WISHLIST */}

          <Link
            href="/wishlist"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition ${
              pathname === "/wishlist"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-950"
            }`}
          >
            <Heart
              size={19}
              className="transition duration-200 group-hover:scale-110"
            />

            {wishlistCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[8px] font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}

          <Link
            href="/cart"
            aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition ${
              pathname === "/cart"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-950"
            }`}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition duration-200 group-hover:scale-110"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1" />
              <circle cx="20" cy="20" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>

            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[8px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* ACCOUNT */}

          <Link
            href="/account"
            className={`ml-1 flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
              pathname === "/account" ||
              pathname.startsWith("/account/")
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-black"
            }`}
          >
            <UserRound size={16} />

            <span>Account</span>
          </Link>

          {/* SELL CTA */}

          <Link
            href="/sell"
            className={`ml-1 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              isActiveRoute(pathname, "/sell")
                ? "bg-indigo-700 shadow-indigo-600/20"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-600/20"
            }`}
          >
            Sell Device
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          aria-label={
            mobileMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setMobileMenuOpen((previous) => !previous)
          }
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50 lg:hidden"
        >
          {mobileMenuOpen ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-gray-200/70 bg-white lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto max-w-7xl px-5 py-4"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActiveRoute(
                  pathname,
                  item.href,
                );

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* MOBILE SEARCH */}

              <div className="mt-2 border-t border-gray-100 pt-3">
                <ProductSearch />
              </div>

              {/* MOBILE ACTIONS */}

              <div className="mt-2 grid grid-cols-3 gap-2">
                <Link
                  href="/wishlist"
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    pathname === "/wishlist"
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Heart size={16} />
                  <span>Wishlist</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeMobileMenu}
                  className={`relative flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    pathname === "/cart"
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="relative">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="9" cy="20" r="1" />
                      <circle cx="20" cy="20" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>

                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[8px] font-bold text-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </span>

                  <span>Cart</span>
                </Link>

                <Link
                  href="/account"
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                    pathname === "/account" ||
                    pathname.startsWith("/account/")
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <UserRound size={16} />
                  <span>Account</span>
                </Link>
              </div>

              {/* MOBILE SELL CTA */}

              <Link
                href="/sell"
                onClick={closeMobileMenu}
                className="mt-2 flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Sell Device
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/* NAVIGATION LINK */

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative mx-1 rounded-full px-4 py-2.5 text-[13px] font-semibold transition duration-200 ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
      }`}
    >
      {label}

      {/* Active / hover underline */}

      <span
        className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-indigo-600 transition-all duration-300 ${
          active
            ? "w-5"
            : "w-0 group-hover:w-4"
        }`}
      />
    </Link>
  );
}
