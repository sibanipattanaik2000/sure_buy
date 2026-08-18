"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";

import {
  useWishlist,
  WishlistPhone,
} from "../context/WishlistContext";

export default function WishlistPage() {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-5 py-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Heart size={17} />
              Your wishlist
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Saved Phones
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Phones you've saved for later.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Clear wishlist
            </button>
          )}

        </div>

        {/* EMPTY */}

        {wishlist.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <Heart
                size={28}
                className="text-indigo-500"
              />
            </div>

            <h2 className="mt-6 text-xl font-black text-gray-950">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Save phones you like and easily come back to
              them whenever you're ready to buy.
            </p>

            <Link
              href="/buy"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Explore Phones
              <ArrowRight size={17} />
            </Link>

          </div>
        ) : (

          /* PRODUCTS */

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {wishlist.map((phone) => (
              <div
                key={phone.id}
                className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* IMAGE */}

                <div className="relative flex h-64 items-center justify-center bg-gray-50 p-6">

                  <img
                    src={phone.image}
                    alt={phone.name}
                    className="h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeFromWishlist(phone.id)
                    }
                    aria-label={`Remove ${phone.name}`}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-md transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

                {/* DETAILS */}

                <div className="p-5">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {phone.brand}
                  </p>

                  <h2 className="mt-1 text-base font-bold text-gray-950">
                    {phone.name}
                  </h2>

                  {phone.storage && (
                    <p className="mt-1 text-xs text-gray-500">
                      {phone.storage}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-400">
                        Starting from
                      </p>

                      <p className="text-lg font-black text-gray-950">
                        ₹{phone.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <Link
                      href={`/buy/${phone.id}`}
                      className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white transition hover:bg-indigo-700"
                    >
                      <ShoppingBag size={15} />
                      Buy
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}