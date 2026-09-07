"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Heart,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Truck,
  Wallet,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getProducts, type Product } from "./lib/api";

type HomeImage = {
  id?: number;
  url?: string | null;
  type?: string;
  position?: number;
};

type HomeVariant = {
  id: number;
  price?: number | string;
  originalPrice?: number | string;
  stock?: number;
  images?: HomeImage[];
};

type HomeProduct = Omit<Product, "images"> & {
  slug?: string;
  description?: string;
  emiFrom?: number | string | null;
  images?: HomeImage[];
  variants?: HomeVariant[];
  highlights?: {
    text: string;
  }[];
};

/* =========================================================
   HERO BANNERS
========================================================= */

const heroBanners = [
  {
    id: 1,
    image: "https://media.phonebhai.com/banners/banners/KPq9l.jpg",
    alt: "PhoneBhai premium phones",
    title: "Premium Phones. Better Prices.",
    description: "Verified smartphones at prices you'll love.",
    buttonText: "Shop Phones",
    buttonLink: "/buy",
  },
  {
    id: 2,
    image: "https://media.phonebhai.com/banners/banners/dK67F.jpg",
    alt: "PhoneBhai affordable smartphones",
    title: "Upgrade Without Overspending.",
    description: "Find quality phones that fit your budget.",
    buttonText: "Explore Phones",
    buttonLink: "/buy",
  },
  {
    id: 3,
    image: "https://media.phonebhai.com/banners/banners/ksBX4.jpg",
    alt: "Sell your phone with PhoneBhai",
    title: "Turn Your Old Phone Into Cash.",
    description: "Sell your phone with a simple doorstep process.",
    buttonText: "Sell Your Phone",
    buttonLink: "/sell",
  },
  {
    id: 4,
    image: "https://media.phonebhai.com/banners/banners/tam8S.jpg",
    alt: "PhoneBhai verified smartphones",
    title: "Your Next Phone Is Waiting.",
    description: "Browse verified devices and choose with confidence.",
    buttonText: "Browse Phones",
    buttonLink: "/buy",
  },
];

/* =========================================================
   TRUST ITEMS
========================================================= */

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Verified phones",
    text: "Quality checked devices",
  },
  {
    icon: BadgeCheck,
    title: "Transparent pricing",
    text: "No hidden surprises",
  },
  {
    icon: Truck,
    title: "Secure delivery",
    text: "Delivered to your doorstep",
  },
  {
    icon: PackageCheck,
    title: "Warranty support",
    text: "Buy with confidence",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function formatPrice(value: unknown): string {
  return `₹${toNumber(value).toLocaleString("en-IN")}`;
}

function conditionLabel(condition?: string): string {
  switch (condition) {
    case "LIKE_NEW":
      return "Like New";

    case "EXCELLENT":
      return "Excellent";

    case "GOOD":
      return "Good";

    default:
      return condition || "Verified";
  }
}

function productHref(product: HomeProduct): string {
  return `/buy/${encodeURIComponent(product.slug || String(product.id))}`;
}

function productMedia(product: HomeProduct): HomeImage | null {
  const variantMedia = (product.variants || [])
    .flatMap((variant) => (Array.isArray(variant.images) ? variant.images : []))
    .filter((media) => Boolean(media?.url))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const productMediaItems = (product.images || [])
    .filter((media) => Boolean(media?.url))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  return variantMedia[0] || productMediaItems[0] || null;
}

function productStock(product: HomeProduct): number {
  if (typeof product.stock === "number") {
    return product.stock;
  }

  return (product.variants || []).reduce(
    (total, variant) => total + toNumber(variant.stock),
    0,
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  index,
}: {
  product: HomeProduct;
  index: number;
}) {
  const media = productMedia(product);
  const price = toNumber(product.price);

  const originalPrice = toNumber(product.originalPrice);

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const rating = toNumber(product.rating);

  const stock = productStock(product);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
      }}
      className="group overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-2xl"
    >
      <Link href={productHref(product)} className="block">
        {/* IMAGE */}
        <div className="relative h-60 overflow-hidden bg-[#f6f7f9]">
          {media?.url ? (
            media.type === "VIDEO" ? (
              <video
                key={`video-${media.id}-${media.url}`}
                src={media.url}
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
              >
                Your browser does not support video playback.
              </video>
            ) : (
              <img
                key={`image-${media.id}-${media.url}`}
                src={media.url}
                alt={product.name}
                loading={index < 4 ? "eager" : "lazy"}
                className="h-full w-full object-contain p-8 transition duration-500 group-hover:scale-105"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <Smartphone size={80} strokeWidth={1} className="text-gray-300" />
            </div>
          )}

          {/* BADGES */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black shadow-sm">
              {conditionLabel(product.condition)}
            </span>

            {discount > 0 && (
              <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black text-white shadow-sm">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* ARROW */}
          <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white">
            <ArrowRight size={17} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
              {product.brand || "Phone"}
            </p>

            {rating > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-gray-600">
                <Star size={13} className="fill-amber-400 text-amber-400" />

                {rating.toFixed(1)}

                {product.reviewCount ? ` (${product.reviewCount})` : ""}
              </span>
            )}
          </div>

          <h3 className="mt-2 line-clamp-1 text-lg font-black text-gray-950">
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            {product.storage && <span>{product.storage}</span>}

            {product.color && <span>• {product.color}</span>}

            {product.warranty && <span>• {product.warranty}</span>}
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xl font-black text-gray-950">
                {formatPrice(price)}
              </p>

              {originalPrice > price && (
                <p className="mt-0.5 text-xs font-medium text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </p>
              )}
            </div>

            <span
              className={`text-[10px] font-black ${
                stock > 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* =========================================================
   PRODUCT SECTION
========================================================= */

function ProductSection({
  eyebrow,
  title,
  description,
  products,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: HomeProduct[];
}) {
  if (!products.length) {
    return null;
  }

  // Show only the first 4 products on homepage
  const visibleProducts = products.slice(0, 4);

  return (
    <section className="bg-white px-5 py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADER */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              {title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              {description}
            </p>
          </div>

          {/* VIEW MORE */}
          <Link
            href="/buy"
            className="hidden shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-800 transition hover:border-indigo-200 hover:text-indigo-600 sm:inline-flex"
          >
            View More
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* MOBILE VIEW MORE */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/buy"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            View More
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const [products, setProducts] = useState<HomeProduct[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* =======================================================
     HERO SLIDER STATE
  ======================================================= */

  const [currentSlide, setCurrentSlide] = useState(0);

  /* =======================================================
     FETCH LIVE BACKEND PRODUCTS
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts({
          page: 1,
          limit: 20,
          category: "Smartphones",
        });

        if (!mounted) {
          return;
        }

        const data = Array.isArray(response.data) ? response.data : [];

        setProducts(data as HomeProduct[]);
      } catch (err) {
        console.error("Homepage product fetch failed:", err);

        if (!mounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Unable to load phones");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SECTIONS
  ======================================================= */

  const freshArrivals = useMemo(() => products.slice(0, 8), [products]);

  const topRated = useMemo(
    () =>
      [...products]
        .sort((a, b) => toNumber(b.rating) - toNumber(a.rating))
        .slice(0, 8),
    [products],
  );

  const bestDeals = useMemo(
    () =>
      [...products]
        .sort((a, b) => {
          const aSaving = toNumber(a.originalPrice) - toNumber(a.price);

          const bSaving = toNumber(b.originalPrice) - toNumber(b.price);

          return bSaving - aSaving;
        })
        .slice(0, 8),
    [products],
  );

  /* =======================================================
     HERO SLIDER
  ======================================================= */

  const heroBannerCount = heroBanners.length;

  /* AUTO SLIDE */

  useEffect(() => {
    if (heroBannerCount < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % heroBannerCount);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [heroBannerCount]);

  /* NEXT */

  function nextSlide() {
    if (!heroBannerCount) {
      return;
    }

    setCurrentSlide((current) => (current + 1) % heroBannerCount);
  }

  /* PREVIOUS */

  function previousSlide() {
    if (!heroBannerCount) {
      return;
    }

    setCurrentSlide(
      (current) => (current - 1 + heroBannerCount) % heroBannerCount,
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="bg-white px-2 py-2 sm:px-3 sm:py-3 lg:px-5 lg:py-5">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[0.75rem] bg-[#111827] shadow-xl sm:rounded-[1rem] lg:rounded-[1.5rem]">
          <div className="relative h-[280px] overflow-hidden sm:h-[360px] lg:h-[470px]">
            {/* =================================================
                BANNER SLIDES
            ================================================= */}

            {heroBanners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={false}
                animate={{
                  opacity: currentSlide === index ? 1 : 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className={`absolute inset-0 ${
                  currentSlide === index
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }`}
              >
                {/* IMAGE */}

                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* DARK OVERLAY */}

                <div className="absolute inset-0 bg-black/30" />

                {/* =================================================
                    TEXT + BUTTON
                ================================================= */}

                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-xl px-10 sm:px-14 lg:px-20">
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: currentSlide === index ? 1 : 0,
                        y: currentSlide === index ? 0 : 20,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: 0.15,
                      }}
                    >
                      <h1 className="max-w-lg text-2xl font-black leading-tight text-white sm:text-3xl lg:text-5xl">
                        {banner.title}
                      </h1>

                      <p className="mt-2 max-w-md text-xs leading-5 text-white/90 sm:mt-3 sm:text-sm sm:leading-6 lg:mt-4 lg:text-base">
                        {banner.description}
                      </p>

                      <Link
                        href={banner.buttonLink}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-gray-950 shadow-lg transition hover:bg-indigo-50 sm:mt-5 sm:px-5 sm:py-3 sm:text-sm lg:mt-6"
                      >
                        {banner.buttonText}

                        <ArrowRight size={15} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* =================================================
                LEFT ARROW
            ================================================= */}

            <button
              type="button"
              onClick={previousSlide}
              aria-label="Previous banner"
              className="absolute left-2 top-1/2 z-30 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md backdrop-blur-sm transition hover:bg-white sm:left-3 sm:h-8 sm:w-8 lg:left-5 lg:h-10 lg:w-10"
            >
              <ChevronLeft className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* =================================================
                RIGHT ARROW
            ================================================= */}

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next banner"
              className="absolute right-2 top-1/2 z-30 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-md backdrop-blur-sm transition hover:bg-white sm:right-3 sm:h-8 sm:w-8 lg:right-5 lg:h-10 lg:w-10"
            >
              <ChevronRight className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* =================================================
                4 SLIDER DOTS
            ================================================= */}

            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-4 lg:bottom-5">
              {heroBanners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-7 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          TRUST BAR
      =================================================== */}

      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-gray-100 lg:grid-cols-4 lg:divide-y-0">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-5 py-5 sm:py-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Icon size={21} />
              </div>

              <div>
                <p className="text-sm font-bold">{title}</p>

                <p className="mt-0.5 text-[11px] text-gray-500 sm:text-xs">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          INTRO
      =================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="rounded-[2rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                PhoneBhai marketplace
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Find a phone that fits your budget.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">
                Browse the live PhoneBhai inventory, compare prices, conditions,
                ratings and warranty before you buy.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
                >
                  Browse all phones
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  Sell your phone
                  <Wallet size={16} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Live inventory",
                "Quality checked",
                "Secure checkout",
                "Warranty support",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <CircleCheck className="text-indigo-600" size={19} />

                  <p className="mt-3 text-sm font-bold text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      {loading ? (
        <section className="bg-white py-24">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <RefreshCw
                className="mx-auto animate-spin text-indigo-600"
                size={30}
              />

              <p className="mt-4 text-sm font-semibold text-gray-500">
                Loading phones from PhoneBhai...
              </p>
            </div>
          </div>
        </section>
      ) : error ? (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-xl px-5 text-center">
            <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
              <Smartphone className="mx-auto text-red-400" size={42} />

              <h2 className="mt-4 text-xl font-black">
                We couldn't load the phones
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">{error}</p>

              <Link
                href="/buy"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white"
              >
                Open phone shop
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      ) : products.length === 0 ? (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-xl px-5 text-center">
            <Smartphone
              className="mx-auto text-gray-300"
              size={52}
              strokeWidth={1.2}
            />

            <h2 className="mt-5 text-2xl font-black">
              No phones available right now
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Check the shop again soon for new inventory.
            </p>

            <Link
              href="/buy"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-bold text-white"
            >
              Browse shop
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      ) : (
        <>
          <div id="products" className="bg-white">
            <ProductSection
              eyebrow="New inventory"
              title="Fresh arrivals"
              description="The latest smartphones added to the live PhoneBhai inventory."
              products={freshArrivals}
            />
          </div>

          <ProductSection
            eyebrow="Customer favourites"
            title="Top rated phones"
            description="Highly rated smartphones from the current backend inventory."
            products={topRated}
          />

          <div className="bg-white">
            <ProductSection
              eyebrow="Better value"
              title="Best deals right now"
              description="Find phones where the current price gives you the biggest saving against the original price."
              products={bestDeals}
            />
          </div>
        </>
      )}

      {/* ===================================================
          SELL CTA
      =================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-gray-950">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/80">
                <Smartphone size={14} />
                SELL YOUR PHONE
              </span>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Turn your old phone into real value.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                Get a competitive estimate, choose a convenient pickup and
                complete the selling process with PhoneBhai.
              </p>

              <Link
                href="/sell"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-950 transition hover:bg-indigo-50"
              >
                Get your phone price
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="relative hidden min-h-[360px] items-center justify-center overflow-hidden lg:flex">
              <div className="absolute h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-9 text-white backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                  Simple process
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    "Choose your phone",
                    "Tell us its condition",
                    "Book doorstep pickup",
                    "Get paid after inspection",
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-black">
                        {index + 1}
                      </span>

                      <span className="text-sm font-semibold text-white/80">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          WHY PHONEBHAI
      =================================================== */}

      <section className="border-t border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified inventory",
                text: "Only active smartphones returned by the PhoneBhai backend are displayed.",
              },
              {
                icon: Heart,
                title: "Easy decisions",
                text: "See price, condition, rating, stock and warranty before opening a product.",
              },
              {
                icon: Smartphone,
                title: "Phone focused",
                text: "No laptops, tablets or unrelated categories — just smartphones.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-3xl border border-gray-200 bg-[#f8f9fb] p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon className="text-indigo-600" size={22} />
                </div>

                <h3 className="mt-5 text-lg font-black">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
