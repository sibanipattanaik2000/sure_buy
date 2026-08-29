
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { products } from "../data/products";

export default function ProductSearch() {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const query = search.trim().toLowerCase();

  const results =
    query.length > 0
      ? products
          .filter(
            (product) =>
              product.name.toLowerCase().includes(query) ||
              product.brand.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query),
          )
          .slice(0, 5)
      : [];

  const closeSearch = () => {
    setSearch("");
    setFocused(false);
  };

  return (
    <div className="relative w-[280px]">
      <div className="flex h-10 items-center rounded-full border border-gray-200 bg-white px-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50">
        <Search size={17} className="shrink-0 text-gray-400" />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-40 bg-transparent px-3 text-sm outline-none placeholder:text-gray-400 text-gray-900 sm:w-60 md:w-80 lg:w-70"
          //className="min-w-0 flex-1 bg-transparent px-2 text-xs font-medium outline-none placeholder:text-gray-400"
        />

        {search && (
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Clear search"
            className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {focused && query && (
        <>
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setFocused(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {results.length > 0 ? (
              <div className="p-2">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Products
                </p>

                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/buy/${product.id}`}
                    onClick={closeSearch}
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {product.brand} • {product.category}
                      </p>

                      <p className="mt-1 text-xs font-black text-indigo-600">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <ArrowRight size={15} className="shrink-0 text-gray-300" />
                  </Link>
                ))}

                <Link
                  href={`/buy?search=${encodeURIComponent(search)}`}
                  onClick={closeSearch}
                  className="mt-1 flex items-center justify-center gap-2 border-t border-gray-100 px-3 py-3 text-xs font-bold text-indigo-600 hover:bg-gray-50"
                >
                  View all results
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <Search size={25} className="mx-auto text-gray-300" />

                <p className="mt-3 text-sm font-bold text-gray-800">
                  No products found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try another product or brand.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
