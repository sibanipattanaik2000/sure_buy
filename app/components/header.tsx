"use client";
import Link from "next/link";
import {
  Heart,
  Menu,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import ProductSearch from "./ProductSearch";
import { useWishlist } from "../context/WishlistContext";
export default function Header() {
    const { wishlistCount } = useWishlist();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* LOGO */}

        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="PhoneBuy Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm transition duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Zap size={18} strokeWidth={2.5} />
          </div>

          <div className="leading-none">
            <span className="text-[21px] font-black tracking-[-0.04em] text-gray-950">
             Phone
            </span>

            <span className="text-[21px] font-black tracking-[-0.04em] text-indigo-600">
              Buy
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
          <NavLink href="/" label="Home" />

          <NavLink href="/buy" label="Buy" />

          <NavLink href="/sell" label="Sell" highlight />

          {/* <NavLink href="/repair" label="Repair" />

          <NavLink href="/about" label="About" /> */}
        </nav>

        {/* ACTIONS */}

        <div className="hidden items-center gap-2 lg:flex">

          {/* SEARCH */}

         <ProductSearch />

          {/* WISHLIST */}

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-950"
          >
            <Heart
              size={19}
              className="transition duration-200 group-hover:scale-110"
            />

            {/* Wishlist count */}

            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[8px] font-bold text-white">
            {wishlistCount}
            </span>
          </Link>

          {/* ACCOUNT */}

          <Link
            href="/account"
            className="ml-1 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:text-black"
          >
            <UserRound size={16} />

            <span>Account</span>
          </Link>

          {/* SELL CTA */}

          <Link
            href="/sell"
            className="ml-1 inline-flex items-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
          >
            Sell Device
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:bg-gray-50 lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}

/* NAVIGATION LINK */

function NavLink({
  href,
  label,
  highlight = false,
}: {
  href: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative mx-1 rounded-full px-4 py-2.5 text-[13px] font-semibold transition duration-200 ${
        highlight
          ? "text-indigo-600 hover:bg-indigo-50"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
      }`}
    >
      {label}

      {/* Animated underline */}

      <span
        className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-all duration-300 ${
          highlight
            ? "w-0 bg-indigo-600 group-hover:w-4"
            : "w-0 bg-black group-hover:w-4"
        }`}
      />
    </Link>
  );
}