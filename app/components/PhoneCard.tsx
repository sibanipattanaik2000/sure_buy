"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";

import {
  useWishlist,
  WishlistPhone,
} from "../context/WishlistContext";

type PhoneCardProps = {
  phone: WishlistPhone;
};

export default function PhoneCard({ phone }: PhoneCardProps) {
  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const saved = isWishlisted(phone.id);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGE SECTION */}

      <div className="relative flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-8">

        {/* Wishlist Button */}

        <button
          type="button"
          onClick={() => toggleWishlist(phone)}
          aria-label={
            saved
              ? `Remove ${phone.name} from wishlist`
              : `Add ${phone.name} to wishlist`
          }
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all duration-200 ${
            saved
              ? "border-indigo-200 bg-indigo-50 text-indigo-600"
              : "border-gray-200 bg-white/90 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          <Heart
            size={18}
            fill={saved ? "currentColor" : "none"}
            className="transition-transform duration-200 group-hover:scale-105"
          />
        </button>

        {/* Saved Badge */}

        {saved && (
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
            <Check size={13} />
            Saved
          </div>
        )}

        {/* Phone Image */}

        <Link
          href={`/buy/${phone.id}`}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={phone.image}
            alt={phone.name}
            className="h-full max-w-[80%] object-contain transition duration-500 ease-out group-hover:scale-105"
          />
        </Link>
      </div>

      {/* DETAILS */}

      <div className="p-5">

        {/* BRAND */}

        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
          {phone.brand}
        </p>

        {/* NAME */}

        <Link href={`/buy/${phone.id}`}>
          <h2 className="mt-1 line-clamp-1 text-lg font-bold text-gray-950 transition hover:text-indigo-600">
            {phone.name}
          </h2>
        </Link>

        {/* STORAGE */}

        {phone.storage && (
          <p className="mt-1 text-sm text-gray-500">
            {phone.storage}
          </p>
        )}

        {/* PRICE + BUY */}

        <div className="mt-5 flex items-end justify-between gap-3">

          <div>
            <p className="text-[11px] font-medium text-gray-400">
              Starting from
            </p>

            <p className="mt-0.5 text-xl font-black tracking-tight text-gray-950">
              ₹{phone.price.toLocaleString("en-IN")}
            </p>
          </div>

          <Link
            href={`/buy/${phone.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-indigo-600"
          >
            <ShoppingBag size={15} />
            View
          </Link>

        </div>

      </div>
    </article>
  );
}