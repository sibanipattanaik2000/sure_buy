"use client";

import { Search, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "iPhone 15",
    price: 42999,
    slug: "iphone-15",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    price: 58999,
    slug: "iphone-15-pro",
  },
  {
    id: "3",
    name: "iPhone 15 Pro Max",
    price: 69999,
    slug: "iphone-15-pro-max",
  },
  {
    id: "4",
    name: "Samsung Galaxy S24",
    price: 54999,
    slug: "samsung-galaxy-s24",
  },
  {
    id: "5",
    name: "Samsung Galaxy S24 Ultra",
    price: 89999,
    slug: "samsung-galaxy-s24-ultra",
  },
  {
    id: "6",
    name: "OnePlus 12",
    price: 59999,
    slug: "oneplus-12",
  },
];

export default function ProductSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (product: Product) => {
    setQuery("");
    setOpen(false);

    router.push(`/product/${product.slug}`);
  };

  return (
    <div className="relative">
      <div
        className={`flex h-11 items-center rounded-full border bg-gray-50 px-3 transition ${
          open
            ? "border-indigo-300 bg-white shadow-lg shadow-indigo-100"
            : "border-gray-200"
        }`}
      >
        <Search size={18} className="text-gray-400" />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search devices..."
          className="w-40 bg-transparent px-3 text-sm outline-none placeholder:text-gray-400 text-gray-900 sm:w-60 md:w-80 lg:w-70"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {open && query.trim() && (
        <>
          <button
            aria-label="Close search"
            className="fixed inset-0 z-[90] cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-14 z-[100] w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Products
              </p>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {results.length > 0 ? (
                results.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelect(product)}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-indigo-50"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                      <Smartphone
                        size={20}
                        className="text-gray-500"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Starting from ₹
                        {product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    No products found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Try searching another device.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}