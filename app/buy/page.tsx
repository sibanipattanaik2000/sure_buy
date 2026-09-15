"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Filter,
  Heart,
  Search,
  ShieldCheck,
  Smartphone,
  Star,
  Tablet,
  Truck,
  Watch,
  X,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

type ProductImage = {
  id: number | string;
  url: string;
  position?: number;
  altText?: string | null;
  key?: string | null;
  type?: "IMAGE" | "VIDEO";
  mimeType?: string | null;
};

type ProductVariant = {
  id: number | string;
  productId: number | string;
  storage?: string | null;
  color?: string | null;
  price?: string | number | null;
  originalPrice?: string | number | null;
  stock?: number;
  images?: ProductImage[];
};

type ApiProduct = {
  id: number | string;
  slug?: string | null;
  brand?: string | null;
  name?: string | null;
  category?: string | null;
  condition?: string | null;
  price?: string | number | null;
  originalPrice?: string | number | null;
  warranty?: string | null;
  description?: string | null;
  rating?: string | number | null;
  reviewCount?: number | null;
  reviewsCount?: number | null;
  emiFrom?: string | number | null;
  active?: boolean;
  images?: ProductImage[];
  variants?: ProductVariant[];
};

type ProductMedia = {
  url: string;
  type: "IMAGE" | "VIDEO";
  altText?: string | null;
};

type Product = {
  id: number;
  slug?: string;
  brand: string;
  name: string;
  category: string;
  storage: string;
  condition: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  warranty: string;
  color: string;
  media: ProductMedia;
  active: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://sure-buy-backend.vercel.app/api/v1"
    : "http://localhost:5000/api/v1");

const FALLBACK_IMAGE = "https://media.phonebhai.com/products/placeholder.png";
const normalizeCondition = (condition?: string | null) => {
  switch (condition) {
    case "LIKE_NEW":
      return "Like New";
    case "EXCELLENT":
      return "Excellent";
    case "GOOD":
      return "Good";
    case "FAIR":
      return "Fair";
    default:
      return condition || "Good";
  }
};

const normalizeProduct = (product: ApiProduct): Product => {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const productImages = Array.isArray(product.images) ? product.images : [];

  const firstVariant = variants[0];

  const variantMedia = variants
    .flatMap((variant) => (Array.isArray(variant.images) ? variant.images : []))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .find((media) => Boolean(media?.url));

  const productMedia = [...productImages]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .find((media) => Boolean(media?.url));

  const selectedMedia = variantMedia || productMedia;

  [
    {
      resource: "/d:/Surebuy/sure_buy/app/buy/page.tsx",
      owner: "typescript",
      code: "2304",
      severity: 8,
      message: "Cannot find name 'variantImage'.",
      source: "ts",
      startLineNumber: 143,
      startColumn: 5,
      endLineNumber: 143,
      endColumn: 17,
      modelVersionId: 57,
      origin: "extHost1",
    },
    {
      resource: "/d:/Surebuy/sure_buy/app/buy/page.tsx",
      owner: "typescript",
      code: "2552",
      severity: 8,
      message: "Cannot find name 'productImage'. Did you mean 'productImages'?",
      source: "ts",
      startLineNumber: 144,
      startColumn: 5,
      endLineNumber: 144,
      endColumn: 17,
      relatedInformation: [
        {
          startLineNumber: 109,
          startColumn: 9,
          endLineNumber: 109,
          endColumn: 22,
          message: "'productImages' is declared here.",
          resource: "/d:/Surebuy/sure_buy/app/buy/page.tsx",
        },
      ],
      modelVersionId: 57,
      origin: "extHost1",
    },
    {
      resource: "/d:/Surebuy/sure_buy/app/buy/page.tsx",
      owner: "typescript",
      code: "2339",
      severity: 8,
      message: "Property 'image' does not exist on type 'Product'.",
      source: "ts",
      startLineNumber: 848,
      startColumn: 40,
      endLineNumber: 848,
      endColumn: 45,
      modelVersionId: 57,
      origin: "extHost1",
    },
  ];

  const price = Number(firstVariant?.price ?? product.price ?? 0);

  const originalPrice = Number(
    firstVariant?.originalPrice ?? product.originalPrice ?? price,
  );

  return {
    id: Number(product.id),
    slug: product.slug || undefined,
    brand: product.brand || "",
    name: product.name || "",
    category: product.category || "",
    storage: firstVariant?.storage || "",
    condition: normalizeCondition(product.condition),
    price,
    originalPrice,
    rating: Number(product.rating ?? 0),
    reviews: Number(product.reviewCount ?? product.reviewsCount ?? 0),
    warranty: product.warranty || "Warranty included",
    color: firstVariant?.color || "",
    media: selectedMedia
      ? {
          url: selectedMedia.url,
          type: selectedMedia.type === "VIDEO" ? "VIDEO" : "IMAGE",
          altText: selectedMedia.altText,
        }
      : {
          url: FALLBACK_IMAGE,
          type: "IMAGE",
        },
    active: product.active !== false,
  };
};

const brands = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Vivo",
  "Oppo",
  "Realme",
  "Motorola",
  "Google",
];

function ProductCard({
  product,
  liked,
  onWishlist,
}: {
  product: Product;
  liked: boolean;
  onWishlist: () => void;
}) {
  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  const saving = Math.max(0, product.originalPrice - product.price);

  return (
    <Link
      href={`/buy/${product.id}`}
      className="group relative overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_25px_60px_rgba(79,70,229,0.15)]"
    >
      <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#f4f5f7] sm:h-64">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-2.5 py-1 text-[10px] font-bold text-white  shadow-indigo-500/20">

            {discount}% OFF
          </span>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onWishlist();
          }}
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition ${
            liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
        >
          <Heart size={17} fill={liked ? "currentColor" : "none"} />
        </button>

        <div className="relative flex h-40 w-32 items-center justify-center transition duration-500 group-hover:scale-105">
          {product.media.type === "VIDEO" ? (
            <video
              src={product.media.url}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <img
              src={product.media.url}
              alt={product.media.altText || product.name}
              loading="lazy"
              className="h-full w-full object-contain"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          )}
        </div>

        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold shadow-sm backdrop-blur">
          {product.condition}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {product.brand}
          </p>

          <div className="flex items-center gap-1 text-[10px] font-bold">
            <Star size={12} fill="currentColor" className="text-yellow-500" />
            {product.rating > 0 ? product.rating.toFixed(1) : "New"}
          </div>
        </div>

        <h2 className="mt-1 text-sm font-bold sm:text-base truncate">
          {product.name}
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          {[product.storage, product.color].filter(Boolean).join(" • ")}
        </p>

        <div className="mt-5">
          <div className="flex items-end gap-2">
            <span className="text-lg font-black sm:text-xl">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {saving > 0 && (
            <p className="mt-1 text-[10px] text-green-600">
              You save ₹{saving.toLocaleString("en-IN")}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
          <BadgeCheck size={15} className="text-indigo-600" />

          <span className="text-[10px] font-semibold text-gray-500">
            {product.warranty}
          </span>
        </div>

        <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-bold text-white transition group-hover:bg-indigo-600">
          View details
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-[#f8f9fb] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
        {icon}
      </div>

      <h3 className="mt-5 font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
    </div>
  );
}

export default function BuyPage() {
  const [category, setCategory] = useState("All");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(400000);
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [mobileFilters, setMobileFilters] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
  const { wishlist, toggleWishlist } = useWishlist();

useEffect(() => {
  const controller = new AbortController();

  const loadProducts = async () => {
    try {
      const isFirstPage = page === 1;

      if (isFirstPage) {
        setLoading(true);
        setError("");
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
  page: String(page),
  limit: "15",
});

const trimmedSearch = search.trim();

if (trimmedSearch) {
  params.set("search", trimmedSearch);
}

if (selectedBrands.length > 0) {
  params.set("brand", selectedBrands.join(","));
}

      const url = `${API_BASE_URL}/products?${params.toString()}`;

      console.log("Fetching products from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        let message = `Unable to load products (${response.status})`;

        try {
          const errorData = await response.json();

          if (errorData?.message) {
            message = errorData.message;
          }
        } catch {
          // Ignore invalid error JSON
        }

        throw new Error(message);
      }

      const data = await response.json();

      if (!data?.success) {
        throw new Error(
          data?.message || "Backend returned an unsuccessful response.",
        );
      }

      const apiProducts: ApiProduct[] = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.products)
          ? data.products
          : [];

      const normalizedProducts = apiProducts
        .filter((product) => product.active !== false)
        .map(normalizeProduct);

      if (isFirstPage) {
        setProducts(normalizedProducts);
      } else {
        setProducts((current) => {
          const existingIds = new Set(current.map((item) => item.id));

          const newProducts = normalizedProducts.filter(
            (item) => !existingIds.has(item.id),
          );

          return [...current, ...newProducts];
        });
      }

      // If fewer than 15 products came back,
      // there are no more products to load.
      setHasMore(normalizedProducts.length === 15);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      console.error("BUY PRODUCTS FETCH ERROR:", err);

      if (page === 1) {
        setProducts([]);
      }

      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "Cannot connect to the backend API. Please make sure the backend is running and CORS/API URL are configured correctly.",
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Unable to load products.",
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  loadProducts();

  return () => {
    controller.abort();
  };
}, [page, search,selectedBrands]);

useEffect(() => {
  if (!hasMore || loading || loadingMore) {
    return;
  }

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // Start loading slightly before the actual bottom
    // so the next products appear smoothly.
    if (scrollPosition >= documentHeight - 700) {
      setPage((current) => current + 1);
    }
  };

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [hasMore, loading, loadingMore]);

useEffect(() => {
  setPage(1);
  setHasMore(true);
}, [search, selectedBrands]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All") {
      result = result.filter((product) => {
        const value =
          `${product.category} ${product.name} ${product.brand}`.toLowerCase();

        if (category === "Smartphones") {
          return (
            value.includes("iphone") ||
            value.includes("samsung") ||
            value.includes("oneplus") ||
            value.includes("google") ||
            value.includes("xiaomi") ||
            value.includes("pixel") ||
            product.category.toLowerCase() === "smartphones"
          );
        }

        if (category === "Tablets") {
          return (
            value.includes("ipad") ||
            value.includes("tablet") ||
            product.category.toLowerCase() === "tablets"
          );
        }

        if (category === "Smartwatches") {
          return (
            value.includes("watch") ||
            value.includes("smartwatch") ||
            product.category.toLowerCase() === "smartwatches"
          );
        }

        return true;
      });
    }

    // if (selectedBrands.length > 0) {
    //   result = result.filter((product) =>
    //     selectedBrands.includes(product.brand),
    //   );
    // }

    result = result.filter((product) => product.price <= maxPrice);

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, category, selectedBrands, maxPrice, sort]);

const toggleBrand = (brand: string) => {
  setSelectedBrands((current) =>
    current.includes(brand)
      ? current.filter((item) => item !== brand)
      : [...current, brand],
  );

  setPage(1);
  setHasMore(true);
};

  const clearFilters = () => {
    setSelectedBrands([]);
    setMaxPrice(400000);
    setCategory("All");
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              PhoneBhai Marketplace
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Find tech you'll love
            </h1>

            <p className="mt-4 max-w-2xl text-gray-500">
              Certified devices, transparent pricing and warranty-backed
              purchases.
            </p>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="mt-8 flex max-w-3xl items-center rounded-2xl border border-indigo-200 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
          >
            <Search className="ml-3 shrink-0 text-gray-400" size={20} />

            <input
              value={search}
onChange={(event) => {
  setSearch(event.target.value);
  setPage(1);
  setHasMore(true);
}}              placeholder="Search iPhone, Samsung, Pixel..."
              className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
            />

            {search && (
              <button
                type="button"
onClick={() => {
  setSearch("");
  setPage(1);
  setHasMore(true);
}}                aria-label="Clear search"
                className="mr-2 text-gray-400 hover:text-black"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="submit"
              className="rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white ">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 ">
          <div className="flex min-w-max items-center justify-between gap-8 overflow-x-auto py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <ShieldCheck size={17} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Quality Checked
                </p>
                <p className="text-[10px] text-gray-500">
                  Multi-point inspection
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                <BadgeCheck size={17} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Warranty Backed
                </p>
                <p className="text-[10px] text-gray-500">Buy with confidence</p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <Truck size={17} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Safe Delivery</p>
                <p className="text-[10px] text-gray-500">
                  Securely packed & tracked
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Smartphone size={17} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  Verified Phones
                </p>
                <p className="text-[10px] text-gray-500">
                  Genuine devices only
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileFilters((current) => !current)}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold lg:hidden"
        >
          <Filter size={17} />
          Filters
        </button>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className={`${mobileFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Filters</h2>

                {(selectedBrands.length > 0 ||
                  maxPrice < 400000 ||
                  category !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-indigo-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="mt-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Brand
                </h3>

                <div className="mt-4 space-y-3">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex cursor-pointer items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="h-4 w-4 rounded border-gray-300 accent-indigo-600"
                        />

                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Maximum price
                </h3>

                <div className="mt-4 flex items-center justify-between text-sm font-bold">
                  <span>₹10K</span>

                  <span>₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>

                <input
                  type="range"
                  min="10000"
                  max="400000"
                  step="5000"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  className="mt-4 w-full accent-indigo-600"
                />
              </div>

              <div className="mt-8 rounded-2xl bg-gray-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="shrink-0 text-indigo-600" size={19} />

                  <div>
                    <p className="text-xs font-bold">Every device is checked</p>

                    <p className="mt-1 text-[11px] leading-5 text-gray-500">
                      Multi-point quality inspection before listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">
                  {loading
                    ? "Loading devices..."
                    : `${filteredProducts.length} ${
                        filteredProducts.length === 1 ? "device" : "devices"
                      }`}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {search
                    ? `Results for "${search}"`
                    : "Showing available products"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-gray-400 sm:block">
                  Sort by
                </span>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-9 text-xs font-bold outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {loading && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white"
                  >
                    <div className="h-64 bg-gray-100" />

                    <div className="space-y-3 p-5">
                      <div className="h-3 w-20 rounded bg-gray-100" />
                      <div className="h-5 w-32 rounded bg-gray-100" />
                      <div className="h-3 w-24 rounded bg-gray-100" />
                      <div className="h-6 w-28 rounded bg-gray-100" />
                      <div className="h-10 w-full rounded-xl bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <h2 className="font-bold text-red-700">
                  Unable to load products
                </h2>

                <p className="mt-2 text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                  <Search size={24} className="text-gray-400" />
                </div>

                <h2 className="mt-5 text-lg font-bold">No devices found</h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    clearFilters();
                  }}
                  className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
                >
                  Clear filters
                </button>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    liked={wishlist.some(
                      (item) => Number(item.id) === product.id,
                    )}
                    onWishlist={() =>
                      toggleWishlist({
                        id: String(product.id),
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        image: product.media.url,
                        storage: product.storage,
                      })
                    }
                  />
                ))}
              </div>
            )}
            {loadingMore && (
  <div className="mt-8 flex items-center justify-center">
    <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />

      <span className="text-xs font-bold text-gray-500">
        Loading more devices...
      </span>
    </div>
  </div>
)}

{!loadingMore && !hasMore && products.length > 0 && (
  <div className="mt-10 flex items-center justify-center">
    <div className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-xs font-semibold text-gray-400">
      You&apos;ve reached the end
    </div>
  </div>
)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <TrustCard
            icon={<ShieldCheck size={21} />}
            title="Quality checked"
            text="Every device goes through a multi-point inspection before it reaches the marketplace."
          />

          <TrustCard
            icon={<Truck size={21} />}
            title="Safe delivery"
            text="Your device is securely packed and delivered with complete order tracking."
          />

          <TrustCard
            icon={<BadgeCheck size={21} />}
            title="Warranty backed"
            text="Eligible devices include warranty coverage for additional purchase confidence."
          />
        </div>
      </section>
    </main>
  );
}
