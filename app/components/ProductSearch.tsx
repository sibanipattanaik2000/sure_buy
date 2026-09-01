"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Loader2,
  Search,
  X,
} from "lucide-react";

import { getProducts, type Product } from "@/app/lib/api";

type SearchProduct = Product & {
  image?: string;
  images?: Array<{
    id?: number;
    url: string;
    altText?: string | null;
    position?: number;
  }>;
};

function getProductImage(product: SearchProduct) {
  if (product.image) {
    return product.image;
  }

  return product.images?.[0]?.url ?? null;
}

export default function ProductSearch() {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const query = search.trim();

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setSearched(false);

        /*
         * Search is intentionally performed by the backend.
         *
         * This keeps the header synchronized with the actual
         * production product catalogue instead of local mock data.
         */
        const response = await getProducts({
          page: 1,
          limit: 5,
          search: query,
        });

        if (!controller.signal.aborted) {
          setResults(
            ((response.data ?? []) as SearchProduct[]).slice(
              0,
              5,
            ),
          );

          setSearched(true);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(
            "HEADER PRODUCT SEARCH ERROR:",
            error,
          );

          setResults([]);
          setSearched(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const closeSearch = () => {
    setSearch("");
    setFocused(false);
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="relative w-[280px]">
      <div className="flex h-10 items-center rounded-full border border-gray-200 bg-white px-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50">
        <Search
          size={17}
          className="shrink-0 text-gray-400"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setFocused(true);
          }}
          onFocus={() => setFocused(true)}
          placeholder="Search products..."
          aria-label="Search products"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />

        {loading && (
          <Loader2
            size={16}
            className="shrink-0 animate-spin text-gray-400"
            aria-label="Searching"
          />
        )}

        {!loading && search && (
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Clear search"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {focused && query && (
        <>
          <button
            type="button"
            aria-label="Close search results"
            onClick={() => setFocused(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            {loading && (
              <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-gray-500">
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Searching products...
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Products
                </p>

                {results.map((product) => {
                  const image = getProductImage(product);

                  return (
                    <Link
                      key={product.id}
                      href={`/buy/${product.id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 p-2">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Search
                            size={18}
                            className="text-gray-300"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-1 truncate text-[11px] text-gray-400">
                          {product.brand ?? "Device"}
                          {product.category
                            ? ` • ${product.category}`
                            : ""}
                        </p>

                        <p className="mt-1 text-xs font-black text-indigo-600">
                          ₹
                          {Number(
                            product.price,
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <ArrowRight
                        size={15}
                        className="shrink-0 text-gray-300"
                      />
                    </Link>
                  );
                })}

                <Link
                  href={`/buy?search=${encodeURIComponent(
                    query,
                  )}`}
                  onClick={() => setFocused(false)}
                  className="mt-1 flex items-center justify-center gap-2 border-t border-gray-100 px-3 py-3 text-xs font-bold text-indigo-600 transition hover:bg-gray-50"
                >
                  View all results
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {!loading &&
              searched &&
              results.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <Search
                    size={25}
                    className="mx-auto text-gray-300"
                  />

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