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
import Image from "next/image";
import { getOptimizedImageUrl } from "./lib/image";

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
    description: "Verified smartphones at prices you'll love",
    buttonText: "Shop Phones",
    buttonLink: "/buy",
  },
  {
    id: 2,
    image: "https://media.phonebhai.com/banners/banners/dK67F.jpg",
    alt: "PhoneBhai affordable smartphones",
    title: "Upgrade Without Overspending.",
    description: "Find quality phones that fit your budget",
    buttonText: "Explore Phones",
    buttonLink: "/buy",
  },
  {
    id: 3,
    image: "https://media.phonebhai.com/banners/banners/ksBX4.jpg",
    alt: "PhoneBhai quality checked smartphones",
    title: "Quality Checked. Ready to Go.",
    description: "Shop verified phones with confidence",
    buttonText: "Shop Verified Phones",
    buttonLink: "/buy",
  },
  {
    id: 4,
    image: "https://media.phonebhai.com/banners/banners/tam8S.jpg",
    alt: "PhoneBhai verified smartphones",
    title: "Your Next Phone Is Waiting.",
    description: "Browse verified devices and choose with confidence",
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
      className="group relative overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_25px_60px_rgba(79,70,229,0.15)]"
    >
      <Link href={productHref(product)} className="block">
        {/* IMAGE */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-indigo-50/40 sm:h-72">
          {" "}
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
                className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-110 sm:p-6"
              >
                Your browser does not support video playback
              </video>
            ) : (
              <Image
                key={`image-${media.id}-${media.url}`}
                src={getOptimizedImageUrl(media.url, 640, 78)}
                alt={product.name}
                width={640}
                height={640}
                priority={index < 2}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 280px"
                className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-110 sm:p-6"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center">
              <Smartphone size={80} strokeWidth={1} className="text-gray-300" />
            </div>
          )}
          {/* BADGES */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1.5 text-[10px] font-black text-gray-800 shadow-lg backdrop-blur-md">
              {conditionLabel(product.condition)}
            </span>

            {discount > 0 && (
              <span className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1.5 text-[10px] font-black text-white shadow-lg shadow-indigo-500/20">
                {discount}% OFF
              </span>
            )}
          </div>
          {/* ARROW */}
          <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-800 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
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

          <h3 className="mt-2 truncate text-lg font-black tracking-tight text-gray-950">
            {" "}
            {product.name}
          </h3>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            {product.storage && <span>{product.storage}</span>}

            {product.color && <span>• {product.color}</span>}

            {product.warranty && <span>• {product.warranty}</span>}
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-black tracking-tight text-gray-950">
                {" "}
                {formatPrice(price)}
              </p>

              {originalPrice > price && (
                <p className="mt-0.5 text-xs font-medium text-gray-400 line-through">
                  {formatPrice(originalPrice)}
                </p>
              )}
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-black tracking-wide ${
                stock > 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
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
  priorityImages = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: HomeProduct[];
  priorityImages?: boolean;
}) {
  const visibleProducts = products.slice(0, 4);

  return (
    <section className="px-5 py-14 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* SECTION HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl">
              {title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              {description}
            </p>
          </div>

          <Link
            href="/buy"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            View all
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* PRODUCTS */}
        {visibleProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
            <Smartphone
              className="mx-auto text-gray-300"
              size={42}
              strokeWidth={1.2}
            />

            <p className="mt-4 text-sm font-semibold text-gray-500">
              No phones available in this section right now.
            </p>
          </div>
        )}
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
    <main className="min-h-screen bg-[#f6f7fb] text-[#111827] selection:bg-indigo-200 selection:text-indigo-950">
      {" "}
      {/* ===================================================
          HERO
      =================================================== */}
      <section className="bg-gradient-to-b from-white via-indigo-50/30 to-[#f6f7fb] px-2 py-3 sm:px-3 sm:py-4 lg:px-5 lg:py-6">
        {" "}
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[1rem] bg-gray-950 shadow-[0_25px_80px_rgba(79,70,229,0.18)] ring-1 ring-black/5 sm:rounded-[1.5rem] lg:rounded-[2rem]">
          {" "}
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

                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="100vw"
                  quality={82}
                  className="object-cover"
                />

                {/* DARK OVERLAY */}

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
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
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black text-gray-950 shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-[0_15px_35px_rgba(0,0,0,0.25)] sm:mt-5 sm:px-6 sm:py-3.5 sm:text-sm lg:mt-6"
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
      <section className="border-y border-gray-100 bg-white shadow-[0_4px_25px_rgba(15,23,42,0.04)]">
        {" "}
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-gray-100 lg:grid-cols-4 lg:divide-y-0">
          {trustItems.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="group flex items-center gap-3 px-5 py-5 transition-colors duration-300 hover:bg-indigo-50/40 sm:py-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
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
              Check the shop again soon for new inventory
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
      {/* PhoneBhai — Give Phones A Second Life */}
      <section className="relative overflow-hidden px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] bg-[#08081a] shadow-[0_35px_100px_rgba(79,70,229,0.22)] sm:min-h-[580px] lg:min-h-[620px]">
            {/* Animated background glow */}
            <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] animate-pulse rounded-full bg-indigo-600/20 blur-[100px]" />
            <div className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] animate-pulse rounded-full bg-violet-600/20 blur-[110px]" />

            {/* Moving gradient blobs */}
            <motion.div
              animate={{
                x: [0, 80, -30, 0],
                y: [0, -40, 50, 0],
                scale: [1, 1.15, 0.95, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-[20%] top-[10%] h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"
            />

            <motion.div
              animate={{
                x: [0, -70, 40, 0],
                y: [0, 50, -30, 0],
                scale: [1, 0.9, 1.15, 1],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-[5%] right-[15%] h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl"
            />

            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "55px 55px",
              }}
            />

            {/* Floating particles */}
            <motion.span
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-[10%] top-[22%] h-1.5 w-1.5 rounded-full bg-indigo-300"
            />

            <motion.span
              animate={{ y: [0, 35, 0], opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute left-[45%] top-[12%] h-2 w-2 rounded-full bg-violet-300"
            />

            <motion.span
              animate={{ y: [0, -25, 0], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
              className="absolute right-[12%] top-[30%] h-1.5 w-1.5 rounded-full bg-fuchsia-300"
            />

            <motion.span
              animate={{ y: [0, 30, 0], opacity: [0.1, 0.8, 0.1] }}
              transition={{ duration: 5.5, repeat: Infinity, delay: 2 }}
              className="absolute bottom-[20%] left-[25%] h-2 w-2 rounded-full bg-indigo-200"
            />

            {/* Main content */}
            <div className="relative z-10 grid min-h-[520px] items-center lg:min-h-[620px] lg:grid-cols-2">
              {/* Left — Brand message */}
              <div className="px-7 py-12 sm:px-12 lg:px-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-200 backdrop-blur-xl sm:text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    The smarter phone cycle
                  </div>

                  <h2 className="mt-6 max-w-xl text-3xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl xl:text-6xl gap-2">
                    {" "}
                    Better phones
                    <br />
                    <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                      Better prices
                    </span>
                    <br />
                    <span className="text-white/90">Better choice </span>
                  </h2>

                  <p className="mt-6 max-w-md text-sm leading-7 text-white/55 sm:text-base">
                    We believe a good smartphone deserves more than one owner
                    PhoneBhai gives pre-owned phones a smarter second life
                  </p>

                  {/* Mini stats */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                        Focus
                      </p>
                      <p className="mt-1 text-sm font-black text-white">
                        Smartphones
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                        Model
                      </p>
                      <p className="mt-1 text-sm font-black text-white">
                        Pre-owned
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur-md">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                        Mission
                      </p>
                      <p className="mt-1 text-sm font-black text-white">
                        Second Life
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right — Animated phone */}
              <div className="relative flex h-[360px] items-center justify-center lg:h-full">
                {/* Outer animated rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-[280px] w-[280px] rounded-full border border-indigo-400/15 sm:h-[350px] sm:w-[350px] lg:h-[420px] lg:w-[420px]"
                >
                  <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-indigo-300 shadow-[0_0_20px_rgba(129,140,248,1)]" />
                </motion.div>

                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-[220px] w-[220px] rounded-full border border-violet-400/15 sm:h-[290px] sm:w-[290px] lg:h-[340px] lg:w-[340px]"
                >
                  <span className="absolute -bottom-1 left-1/2 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_20px_rgba(167,139,250,1)]" />
                </motion.div>

                {/* Glow behind phone */}
                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                    opacity: [0.35, 0.55, 0.35],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute h-48 w-48 rounded-full bg-indigo-500/30 blur-[70px] sm:h-64 sm:w-64"
                />

                {/* Floating phone */}
                <motion.div
                  animate={{
                    y: [0, -18, 0],
                    rotate: [-2, 2, -2],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-20"
                >
                  {/* Phone shadow */}
                  <div className="absolute -bottom-8 left-1/2 h-10 w-40 -translate-x-1/2 rounded-full bg-black/60 blur-2xl" />

                  {/* Phone body */}
                  <div className="relative h-[290px] w-[145px] rounded-[2.2rem] border-[5px] border-gray-700 bg-gradient-to-br from-gray-800 via-gray-950 to-black p-1 shadow-[0_30px_80px_rgba(0,0,0,0.7)] sm:h-[350px] sm:w-[175px] lg:h-[390px] lg:w-[195px]">
                    {/* Side buttons */}
                    <div className="absolute -right-[7px] top-20 h-12 w-1 rounded-r-full bg-gray-600" />
                    <div className="absolute -left-[7px] top-24 h-8 w-1 rounded-l-full bg-gray-600" />
                    <div className="absolute -left-[7px] top-36 h-8 w-1 rounded-l-full bg-gray-600" />

                    {/* Screen */}
                    <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-indigo-950 via-violet-950 to-gray-950">
                      {/* Screen glow */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(129,140,248,0.5),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(217,70,239,0.35),transparent_40%)]" />

                      {/* Dynamic wallpaper */}
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          rotate: [0, 8, 0],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -left-10 top-20 h-40 w-40 rounded-full bg-indigo-500/30 blur-2xl"
                      />

                      <motion.div
                        animate={{
                          scale: [1.1, 1, 1.1],
                          x: [0, 15, 0],
                        }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-fuchsia-500/25 blur-2xl"
                      />

                      {/* Camera island */}
                      <div className="absolute left-3 top-3 h-16 w-12 rounded-2xl border border-white/10 bg-black/50 p-2 shadow-lg backdrop-blur-md">
                        <div className="grid grid-cols-2 gap-1.5">
                          <span className="h-4 w-4 rounded-full border border-gray-600 bg-gray-900 shadow-inner" />
                          <span className="h-4 w-4 rounded-full border border-gray-600 bg-gray-900 shadow-inner" />
                          <span className="h-4 w-4 rounded-full border border-gray-600 bg-gray-900 shadow-inner" />
                          <span className="h-4 w-4 rounded-full bg-indigo-400/60" />
                        </div>
                      </div>

                      {/* Screen content */}
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <div className="rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500">
                              <RefreshCw className="h-3.5 w-3.5 text-white" />
                            </div>

                            <div>
                              <p className="text-[7px] font-bold uppercase tracking-wider text-white/40">
                                PhoneBhai
                              </p>
                              <p className="text-[9px] font-black text-white">
                                Ready for a second life
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div className="absolute bottom-1.5 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-white/70" />
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge — inspected */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-[4%] top-[18%] z-30 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl sm:left-[8%]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-white">
                        Quality Checked
                      </p>
                      <p className="text-[8px] text-white/40">Before resale</p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge — value */}
                <motion.div
                  animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-[17%] right-[2%] z-30 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl sm:right-[8%]"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                      <RefreshCw className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-white">
                        Second Life
                      </p>
                      <p className="text-[8px] text-white/40">Better value</p>
                    </div>
                  </div>
                </motion.div>

                {/* Tiny orbit dots */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-[300px] w-[300px] sm:h-[380px] sm:w-[380px]"
                >
                  <span className="absolute right-2 top-1/2 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_18px_rgba(232,121,249,0.9)]" />
                </motion.div>
              </div>
            </div>

            {/* Bottom brand line */}
            <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-white/[0.03] px-6 py-4 backdrop-blur-md sm:px-10">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 sm:text-[10px]">
                  Buy • Sell • Refurbish • Repeat
                </p>

                <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 sm:text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Smartphones, reimagined
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Refurbished Phone Value Section */}
      <section className="bg-gradient-to-b from-white via-indigo-50/30 to-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-600">
              <Smartphone className="h-4 w-4" />
              The PhoneBhai way
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl lg:text-5xl">
              Refurbished phones
              <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Better value
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              We give pre-owned smartphones a second life by putting them
              through a quality-focused process before they reach their next
              owner
            </p>
          </div>

          {/* Feature cards */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-[0_20px_50px_rgba(79,70,229,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-110">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-black text-gray-950">
                Quality checked
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Devices are checked for functionality and overall condition
                before being listed
              </p>
            </div>

            <div className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110">
                <BadgeCheck className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-black text-gray-950">
                Honest condition
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                See the device condition, rating, warranty and important details
                before buying
              </p>
            </div>

            <div className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
                <Wallet className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-black text-gray-950">
                Better prices
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Get access to premium smartphones at prices that make upgrading
                easier
              </p>
            </div>

            <div className="group rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(249,115,22,0.12)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:scale-110">
                <RefreshCw className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-black text-gray-950">
                Second life
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Your old smartphone can become someone else's next great phone
                instead of sitting unused
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* PhoneBhai Cycle */}
      <section className="px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-7 shadow-[0_20px_60px_rgba(79,70,229,0.08)] sm:p-10 lg:p-14">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-300/20 blur-3xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                  The PhoneBhai cycle
                </p>

                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-gray-950 sm:text-4xl">
                  From your old phone
                  <span className="block text-indigo-600">
                    to someone's next phone
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                  We believe good smartphones deserve a second chance. PhoneBhai
                  connects sellers and buyers through a smarter
                  refurbished-phone ecosystem
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm">
                    Sell
                  </span>

                  <span className="text-gray-300">→</span>

                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm">
                    Inspect
                  </span>

                  <span className="text-gray-300">→</span>

                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm">
                    Refurbish
                  </span>

                  <span className="text-gray-300">→</span>

                  <span className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md">
                    Resell
                  </span>
                </div>
              </div>

              {/* Right side highlight */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div className="text-3xl font-black text-indigo-600">♻</div>
                  <h3 className="mt-4 text-base font-black text-gray-950">
                    Less waste
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Extend the useful life of smartphones instead of letting
                    perfectly usable devices go to waste
                  </p>
                </div>

                <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div className="text-3xl font-black text-violet-600">₹</div>
                  <h3 className="mt-4 text-base font-black text-gray-950">
                    More value
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Sellers unlock value from their old phones while buyers get
                    better devices at better prices
                  </p>
                </div>

                <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:col-span-2">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                      <Smartphone className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-base font-black text-gray-950">
                        Smartphones, and only smartphones
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No laptops. No tablets. No unrelated categories. Just
                        phones — bought, checked, refurbished and resold
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
