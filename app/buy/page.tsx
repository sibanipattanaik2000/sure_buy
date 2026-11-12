"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Filter,
  Heart,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Truck,
  X,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import Image from "next/image";
import { getOptimizedImageUrl } from "../lib/image";

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
  "https://api.phonebhai.com/api/v1";

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
    <div className="group relative min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg sm:rounded-2xl">
      {/* Product image and details link */}
      <Link href={`/buy/${product.id}`} className="block">
        <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gray-50 sm:h-48 md:h-52">
          {discount > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-green-600 px-2 py-1 text-[9px] font-extrabold text-white shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
              {discount}% OFF
            </span>
          )}

          <div className="relative flex h-28 w-24 items-center justify-center transition duration-500 group-hover:scale-105 sm:h-40 sm:w-32 md:h-44 md:w-36">
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
              <Image
                src={getOptimizedImageUrl(product.media.url, 640, 78)}
                alt={product.media.altText || product.name}
                width={640}
                height={640}
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 320px"
                className="h-full w-full object-contain"
              />
            )}
          </div>

          <span className="absolute bottom-2 left-2 max-w-[75%] truncate rounded-full border border-gray-100 bg-white/95 px-2 py-1 text-[9px] font-bold text-black shadow-sm backdrop-blur sm:bottom-3 sm:left-3 sm:px-3 sm:text-[10px]">
            {product.condition}
          </span>
        </div>

        <div className="p-2.5 sm:p-3 md:p-4">
          <div className="flex min-w-0 items-center justify-between gap-1">
            <p className="truncate text-[9px] font-bold uppercase tracking-wider text-gray-500 sm:text-[10px]">
              {product.brand}
            </p>

            <div className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-black sm:text-[10px]">
              <Star size={12} fill="currentColor" className="text-yellow-500" />
              {product.rating > 0 ? product.rating.toFixed(1) : "New"}
            </div>
          </div>

          <h2 className="mt-1 line-clamp-2 min-h-[2.5em] text-xs font-extrabold leading-5 text-black sm:text-sm">
            {product.name}
          </h2>

          <p className="mt-1 truncate text-[10px] text-gray-500 sm:text-xs">
            {[product.storage, product.color].filter(Boolean).join(" • ") ||
              "\u00A0"}
          </p>

          <div className="mt-3 sm:mt-4">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <span className="text-sm font-black text-black sm:text-lg">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {product.originalPrice > product.price && (
                <span className="text-[9px] text-gray-400 line-through sm:text-xs">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {saving > 0 && (
              <p className="mt-1 text-[9px] font-bold text-green-600 sm:text-[10px]">
                Save ₹{saving.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-1.5 border-t border-gray-100 pt-3 sm:mt-4 sm:gap-2 sm:pt-3">
            <BadgeCheck size={14} className="shrink-0 text-black" />
            <span className="truncate text-[9px] font-semibold text-gray-500 sm:text-[10px]">
              {product.warranty}
            </span>
          </div>

          <div className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-black px-2 py-2.5 text-[10px] font-bold text-white transition group-hover:bg-gray-800 sm:mt-4 sm:rounded-xl sm:py-3 sm:text-xs">
            Shop Now
            <ArrowRight size={13} />
          </div>
        </div>
      </Link>

      {/* Wishlist button is now outside the product Link */}
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
        aria-pressed={liked}
        className={`absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition hover:scale-105 sm:right-3 sm:top-3 sm:h-9 sm:w-9 ${
          liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
      </button>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:rounded-2xl sm:p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-bold text-black">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
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

        if (category !== "All") {
          params.set("category", category);
        }

        if (selectedBrands.length > 0) {
          params.set("brand", selectedBrands.join(","));
        }

        if (maxPrice < 400000) {
          params.set("maxPrice", String(maxPrice));
        }

        const sortMap: Record<string, string> = {
          featured: "newest",
          low: "price_asc",
          high: "price_desc",
          rating: "rating",
        };

        params.set("sort", sortMap[sort] || "newest");

        const response = await fetch(
          `${API_BASE_URL}/products?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.message || `Unable to load products (${response.status})`,
          );
        }

        const apiProducts: ApiProduct[] = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.products)
            ? data.products
            : [];

        const pagination = data.pagination;

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

        setHasMore(
          typeof pagination?.hasNextPage === "boolean"
            ? pagination.hasNextPage
            : normalizedProducts.length === 15,
        );
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        console.error("BUY PRODUCTS FETCH ERROR:", err);

        if (page === 1) {
          setProducts([]);
        }

        setError(
          err instanceof Error ? err.message : "Unable to load products.",
        );
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
  }, [page, search, selectedBrands, category, maxPrice, sort]);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) {
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // Start loading slightly before the actual bottom.
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
  }, [search, selectedBrands, category, maxPrice, sort]);

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

    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.some(
          (brand) => product.brand.toLowerCase() === brand.toLowerCase(),
        ),
      );
    }

    result = result.filter((product) => product.price <= maxPrice);

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
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setMaxPrice(400000);
    setCategory("All");
  };

  const activeFilterCount =
    selectedBrands.length +
    (maxPrice < 400000 ? 1 : 0) +
    (category !== "All" ? 1 : 0);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero and search */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-3 py-7 sm:px-5 sm:py-9 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 sm:text-xs">
              PhoneBhai Marketplace
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Find tech you&apos;ll love
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-500 sm:mt-3 sm:text-sm">
              Certified devices, transparent pricing and warranty-backed
              purchases.
            </p>
          </div>

          <form
            onSubmit={(event) => event.preventDefault()}
            className="mt-5 flex max-w-3xl items-center rounded-xl border border-gray-300 bg-white p-1.5 shadow-sm sm:mt-7 sm:rounded-2xl sm:p-2"
          >
            <Search className="ml-2 shrink-0 text-gray-400 sm:ml-3" size={18} />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              placeholder="Search iPhone, Samsung, Pixel..."
              className="h-10 min-w-0 flex-1 bg-transparent px-2 text-xs text-black outline-none placeholder:text-gray-400 sm:h-12 sm:px-4 sm:text-sm"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                }}
                aria-label="Clear search"
                className="mr-2 text-gray-400 transition hover:text-black"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              className="rounded-lg bg-black px-3 py-2.5 text-xs font-bold text-white transition hover:bg-gray-800 sm:rounded-xl sm:px-5 sm:py-3 sm:text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Products and filters */}
      <section className="mx-auto max-w-7xl px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
        <button
          type="button"
          onClick={() => setMobileFilters((current) => !current)}
          aria-expanded={mobileFilters}
          className="mb-3 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-black transition hover:border-black lg:hidden"
        >
          <span className="flex items-center gap-2">
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </span>

          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${
              mobileFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-5">
          {/* Filter sidebar */}
          <aside className={`${mobileFilters ? "block" : "hidden"} lg:block`}>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:sticky lg:top-24 sm:rounded-2xl">
              <div className="border-b border-gray-200 bg-black p-4 text-white sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Filter size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                        PhoneBhai
                      </span>
                    </div>

                    <h2 className="mt-2 text-base font-black sm:text-lg">
                      Refine your search
                    </h2>

                    <p className="mt-1 text-[10px] text-gray-300">
                      Find your perfect device
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-lg border border-white/30 px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-white hover:text-black"
                  >
                    Reset
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg border border-white/20 bg-white/10 px-3 py-2">
                  <span className="text-[10px] text-gray-200">
                    Filters selected
                  </span>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-2 text-[10px] font-black text-black">
                    {activeFilterCount}
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-3.5 sm:p-4 b">
                {/* Brands */}
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold text-black">
                        Shop by brand
                      </h3>
                      <p className="mt-1 text-[10px] text-gray-400">
                        Choose your favourite
                      </p>
                    </div>

                    <Smartphone size={17} className="text-black" />
                  </div>

                  <div className="grid grid-cols-2 xl:grid-cols-2 gap-2 sm:gap-3">
                    {" "}
                    {brands.map((brand) => {
                      const active = selectedBrands.includes(brand);

                      return (
                        <label
                          key={brand}
                          className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 transition-all duration-200 ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleBrand(brand)}
                            className="h-3.5 w-3.5 shrink-0 accent-black"
                          />

                          <span className="min-w-0 whitespace-nowrap text-xs font-bold">
                            {brand}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>

                <div className="border-t border-gray-100" />

                {/* Budget */}
                <section>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold text-black">
                        Your budget
                      </h3>
                      <p className="mt-1 text-[10px] text-gray-400">
                        Find the right price
                      </p>
                    </div>

                    <span className="rounded-md bg-black px-2 py-1 text-[9px] font-extrabold text-white">
                      PRICE
                    </span>
                  </div>

                  <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">
                      Up to
                    </p>

                    <p className="mt-1 text-xl font-black text-black">
                      ₹{maxPrice.toLocaleString("en-IN")}
                    </p>

                    <input
                      type="range"
                      min="10000"
                      max="400000"
                      step="5000"
                      value={maxPrice}
                      onChange={(event) =>
                        setMaxPrice(Number(event.target.value))
                      }
                      aria-label="Maximum product price"
                      className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-black"
                      style={{
                        background: `linear-gradient(to right, #000000 ${
                          ((maxPrice - 10000) / 390000) * 100
                        }%, #d1d5db ${((maxPrice - 10000) / 390000) * 100}%)`,
                      }}
                    />

                    <div className="mt-2 flex justify-between text-[9px] font-semibold text-gray-400">
                      <span>₹10K</span>
                      <span>₹4L</span>
                    </div>
                  </div>

                  <p className="mb-2 mt-3 text-[10px] font-bold text-gray-500">
                    Quick select
                  </p>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { label: "₹15K", value: 15000 },
                      { label: "₹30K", value: 30000 },
                      { label: "₹50K", value: 50000 },
                    ].map((preset) => {
                      const active = maxPrice === preset.value;

                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setMaxPrice(preset.value)}
                          aria-pressed={active}
                          className={`rounded-lg border py-2 text-[10px] font-extrabold transition ${
                            active
                              ? "border-black bg-black text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
                          }`}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setMaxPrice(400000)}
                    className="mt-2 w-full rounded-lg border border-dashed border-gray-300 py-2 text-[10px] font-bold text-gray-500 transition hover:border-black hover:text-black"
                  >
                    Show all prices
                  </button>
                </section>

                {/* Trust panel */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                      <ShieldCheck size={18} />
                    </div>

                    <div>
                      <p className="text-[11px] font-extrabold text-black">
                        Shop with confidence
                      </p>

                      <p className="mt-1 text-[10px] leading-4 text-gray-500">
                        Quality-checked devices, transparent pricing and
                        warranty-backed purchases.
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-black">
                        <BadgeCheck size={12} />
                        Quality comes first
                      </div>
                    </div>
                  </div>
                </div>

                {(selectedBrands.length > 0 ||
                  maxPrice < 400000 ||
                  category !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-[10px] font-extrabold text-gray-600 transition hover:border-black hover:bg-black hover:text-white"
                  >
                    <X size={14} />
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Product listing */}
          <div className="min-w-0">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold text-black sm:text-sm">
                  {loading
                    ? "Loading devices..."
                    : `${filteredProducts.length} ${
                        filteredProducts.length === 1 ? "device" : "devices"
                      }`}
                </p>

                <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                  {search
                    ? `Results for "${search}"`
                    : "Showing available products"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <span className="text-[10px] text-gray-400 sm:text-xs">
                  Sort by
                </span>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-[10px] font-bold text-black outline-none transition focus:border-black sm:h-10 sm:text-xs"
                  >
                    <option value="featured">Featured</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>

                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Loading skeletons: always two columns */}
            {loading && (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white sm:rounded-2xl"
                  >
                    <div className="h-36 bg-gray-100 sm:h-48 md:h-52" />

                    <div className="space-y-2 p-2.5 sm:p-4">
                      <div className="h-2.5 w-16 rounded bg-gray-100" />
                      <div className="h-4 w-3/4 rounded bg-gray-100" />
                      <div className="h-3 w-1/2 rounded bg-gray-100" />
                      <div className="h-5 w-2/3 rounded bg-gray-100" />
                      <div className="h-8 w-full rounded-lg bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center sm:rounded-2xl sm:p-8">
                <h2 className="text-sm font-bold text-black">
                  Unable to load products
                </h2>

                <p className="mt-2 text-xs text-gray-600">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-black px-5 py-2.5 text-xs font-bold text-white transition hover:bg-gray-800"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center sm:rounded-2xl sm:px-6 sm:py-16">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <Search size={22} className="text-gray-500" />
                </div>

                <h2 className="mt-4 text-base font-bold text-black">
                  No devices found
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    clearFilters();
                  }}
                  className="mt-4 rounded-lg bg-black px-5 py-2.5 text-xs font-bold text-white transition hover:bg-gray-800"
                >
                  Clear filters
                </button>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
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
              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-black" />

                  <span className="text-[10px] font-bold text-gray-500 sm:text-xs">
                    Loading more devices...
                  </span>
                </div>
              </div>
            )}

            {!loadingMore && !hasMore && products.length > 0 && (
              <div className="mt-8 flex items-center justify-center">
                <div className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-[10px] font-semibold text-gray-400 sm:text-xs">
                  You&apos;ve reached the end
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom trust cards */}
      <section className="mx-auto max-w-7xl px-3 pb-8 sm:px-5 sm:pb-12 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <TrustCard
            icon={<ShieldCheck size={19} />}
            title="Quality checked"
            text="Every device goes through a multi-point inspection before it reaches the marketplace."
          />

          <TrustCard
            icon={<Truck size={19} />}
            title="Safe delivery"
            text="Your device is securely packed and delivered with complete order tracking."
          />

          <TrustCard
            icon={<BadgeCheck size={19} />}
            title="Warranty backed"
            text="Eligible devices include warranty coverage for additional purchase confidence."
          />
        </div>
      </section>
    </main>
  );
}
