"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Star,
  Truck,
  Wallet,
  Recycle,
} from "lucide-react";
import { motion } from "framer-motion";

import { getProducts, type Product } from "./lib/api";
import { getOptimizedImageUrl } from "./lib/image";
import { useWishlist } from "./context/WishlistContext";

/* =========================================================
   TYPES
========================================================= */

type ProductImage = {
  id?: number | string;
  url?: string | null;
  type?: string;
  position?: number;
};

type ProductVariant = {
  id?: number;
  stock?: number;
  images?: ProductImage[];
};

type HomeProduct = Omit<Product, "images"> & {
  slug?: string;
  description?: string;
  images?: (string | ProductImage)[];
  variants?: ProductVariant[];
  emiFrom?: number | string | null;
};

/* =========================================================
   HERO BANNERS
========================================================= */

const heroBanners = [
  {
    id: 1,
    image: "https://media.phonebhai.com/banners/banners/KPq9l.jpg",
    alt: "PhoneBhai premium smartphones",
  },
  {
    id: 2,
    image: "https://media.phonebhai.com/banners/banners/dK67F.jpg",
    alt: "PhoneBhai affordable smartphones",
  },
  {
    id: 3,
    image: "https://media.phonebhai.com/banners/banners/ksBX4.jpg",
    alt: "PhoneBhai verified smartphones",
  },
  {
    id: 4,
    image: "https://media.phonebhai.com/banners/banners/tam8S.jpg",
    alt: "Shop smartphones at PhoneBhai",
  },
];

/* =========================================================
   STATIC BRAND LOGOS
========================================================= */

const brandLogos = [
  { name: "Apple", slug: "apple" },
  { name: "Samsung", slug: "samsung" },
  { name: "Google", slug: "google" },
  { name: "Motorola", slug: "motorola" },
  { name: "Xiaomi", slug: "xiaomi" },
];

/* =========================================================
   STATIC REVIEWS
========================================================= */

const staticReviews = [
  {
    id: 1,
    name: "Rohit S.",
    comment: "Amazing quality!",
    sub: "Totally worth the price.",
    rating: 5,
  },
  {
    id: 2,
    name: "Priya M.",
    comment: "Phone looks like new and works flawlessly.",
    sub: "",
    rating: 5,
  },
  {
    id: 3,
    name: "Aman K.",
    comment: "Great service and fast delivery!",
    sub: "",
    rating: 5,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function priceLabel(value: unknown): string {
  return `₹${numberValue(value).toLocaleString("en-IN")}`;
}

function getConditionLabel(condition?: string): string {
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

function getProductHref(product: HomeProduct): string {
  return `/buy/${encodeURIComponent(product.slug || String(product.id))}`;
}

function getProductImage(product: HomeProduct): ProductImage | null {
  const variantImages = (product.variants || [])
    .flatMap((variant) =>
      Array.isArray(variant.images) ? variant.images : [],
    )
    .filter((image) => Boolean(image?.url))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const productImages = (product.images || [])
    .map((image) => {
      if (typeof image === "string") return { url: image };
      return image;
    })
    .filter(
      (image): image is ProductImage =>
        Boolean(image && typeof image === "object" && image.url),
    )
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  if (variantImages.length > 0) return variantImages[0];
  if (productImages.length > 0) return productImages[0];
  if (product.image) return { url: product.image };
  return null;
}

function getProductStock(product: HomeProduct): number {
  if (typeof product.stock === "number") return product.stock;
  return (product.variants || []).reduce(
    (total, variant) => total + numberValue(variant.stock),
    0,
  );
}

function getDiscount(product: HomeProduct): number {
  const price = numberValue(product.price);
  const originalPrice = numberValue(product.originalPrice);
  if (originalPrice <= price || originalPrice <= 0) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function getSaving(product: HomeProduct): number {
  return numberValue(product.originalPrice) - numberValue(product.price);
}

/* =========================================================
   VIBRATING SHOP BUTTON
========================================================= */

const shopButtonClass =
  "inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-5 py-2.5 text-xs font-black text-black shadow-[0_0_30px_rgba(255,255,255,0.45)] transition hover:scale-105 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_35px_rgba(99,102,241,0.6)] sm:px-7 sm:py-3.5 sm:text-sm animate-[vibrate_1.8s_ease-in-out_infinite]";

/* =========================================================
   BRAND LOGOS – seamless right → left infinite marquee
========================================================= */


function BrandLogos() {
  const items = [...brandLogos, ...brandLogos, ...brandLogos];

  return (
    <section className="overflow-hidden border-y border-gray-200 bg-gray-50 py-7 sm:py-9">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex items-end justify-between sm:mb-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 sm:text-xs">
              Shop your favourite brands
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-black sm:text-2xl">
              Explore Top Brands
            </h2>
          </div>

          <Link
            href="/buy"
            className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-bold text-black transition hover:underline sm:text-sm"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-gray-50 to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-gray-50 to-transparent sm:w-16" />

        <div className="phonebhai-brand-track flex w-max items-center gap-3 px-3 sm:gap-5 sm:px-6">
          {items.map((brand, index) => (
            <Link
              key={`${brand.name}-${index}`}
              href={`/buy?brand=${encodeURIComponent(brand.name)}`}
              className="group flex h-[76px] min-w-[145px] shrink-0 items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-md sm:h-[90px] sm:min-w-[185px] sm:gap-4 sm:rounded-2xl sm:px-7"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-black sm:h-12 sm:w-12">
                <img
                  src={`https://cdn.simpleicons.org/${brand.slug}/111111`}
                  alt={brand.name}
                  className="h-5 w-5 object-contain transition group-hover:brightness-0 group-hover:invert sm:h-6 sm:w-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              <span className="whitespace-nowrap text-sm font-black tracking-tight text-gray-900 transition group-hover:text-black sm:text-base">
                {brand.name}
              </span>

              <ArrowRight
                size={14}
                className="ml-auto text-gray-300 transition group-hover:translate-x-1 group-hover:text-black"
              />
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .phonebhai-brand-track {
          animation: brand-marquee 18s linear infinite;
        }

        .phonebhai-brand-track:hover {
          animation-play-state: paused;
        }

        @keyframes brand-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}


/* =========================================================
   HERO SLIDER
========================================================= */

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((current) => (current + 1) % heroBanners.length);
  }, []);

  const previousSlide = useCallback(() => {
    setCurrentSlide(
      (current) => (current - 1 + heroBanners.length) % heroBanners.length,
    );
  }, []);

  useEffect(() => {
    const timer = window.setInterval(nextSlide, 5000);
    return () => window.clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="w-full overflow-hidden">
      <div className="relative h-[210px] w-full sm:h-[300px] md:h-[360px] lg:h-[420px]">
        {heroBanners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={false}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 ${
              currentSlide === index
                ? "pointer-events-auto"
                : "pointer-events-none"
            }`}
          >
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60" />
          </motion.div>
        ))}

        {/* Vibrating Shop Now – 1st banner bottom center, others right center */}
        <Link
          href="/buy"
          className={`${shopButtonClass} absolute z-20 ${
            currentSlide === 0
              ? "bottom-5 left-1/2 -translate-x-1/2 sm:bottom-8"
              : "right-4 top-1/2 -translate-y-1/2 sm:right-8 lg:right-12"
          }`}
        >
          Shop Now
          <ArrowRight size={16} />
        </Link>

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous banner"
          className="absolute left-3 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur transition hover:bg-white sm:left-5 sm:h-10 sm:w-10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next banner"
          className="absolute right-3 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur transition hover:bg-white sm:right-5 sm:h-10 sm:w-10"
        >
          <ChevronRight size={18} />
        </button>

        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
          {heroBanners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show banner ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === index ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
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
  const { toggleWishlist, isWishlisted } = useWishlist();

  const productId = String(product.id);
  const saved = isWishlisted(productId);
  const image = getProductImage(product);
  const stock = getProductStock(product);
  const discount = getDiscount(product);
  const rating = numberValue(product.rating);
  const imageUrl = image?.url || product.image || "";

  const handleWishlist = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    await toggleWishlist({
      id: productId,
      name: product.name,
      brand: product.brand || "",
      price: numberValue(product.price),
      image: imageUrl,
      storage: product.storage,
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-35px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl sm:rounded-2xl"
    >
      <div className="relative">
        <Link
          href={getProductHref(product)}
          className="block"
          aria-label={`View ${product.name}`}
        >
          <div className="relative flex h-[150px] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 sm:h-[210px] lg:h-[225px]">
            {imageUrl ? (
              image?.type === "VIDEO" ? (
                <video
                  src={imageUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain p-3 sm:p-5"
                />
              ) : (
                <Image
                  src={getOptimizedImageUrl(imageUrl, 480, 78)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 280px"
                  priority={index < 2}
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 sm:p-5"
                />
              )
            ) : (
              <Smartphone
                size={54}
                strokeWidth={1}
                className="text-gray-300 sm:h-16 sm:w-16"
              />
            )}
          </div>
        </Link>

        <div className="absolute left-2 top-2 flex max-w-[75%] flex-wrap gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          <span className="rounded-full border border-gray-200 bg-white/95 px-2 py-1 text-[8px] font-bold text-gray-700 shadow-sm sm:text-[9px]">
            {getConditionLabel(product.condition)}
          </span>
          {discount > 0 && (
            <span className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-2 py-1 text-[8px] font-black text-white shadow-sm sm:text-[9px]">
              {discount}% OFF
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={saved}
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white/95 shadow-sm transition hover:scale-110 sm:right-3 sm:top-3 sm:h-9 sm:w-9 ${
            saved ? "bg-red-50" : ""
          }`}
        >
          <Heart
            size={17}
            strokeWidth={2}
            fill={saved ? "#ef4444" : "none"}
            className="text-red-500"
          />
        </button>
      </div>

      <div className="p-2.5 sm:p-4">
        <div className="flex min-h-4 items-center justify-between gap-1">
          <p className="truncate text-[8px] font-black uppercase tracking-wider text-gray-500 sm:text-[10px]">
            {product.brand || "Phone"}
          </p>
          {rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-[9px] font-bold text-emerald-600 sm:text-[11px]">
              <Star size={11} className="fill-emerald-500 text-emerald-500" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <Link href={getProductHref(product)}>
          <h3 className="mt-1.5 min-h-[34px] line-clamp-2 text-[11px] font-bold leading-4 text-gray-950 hover:underline sm:min-h-[42px] sm:text-sm sm:leading-5">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 min-h-4 truncate text-[8px] text-gray-500 sm:text-[10px]">
          {[product.storage, product.color, product.warranty]
            .filter(Boolean)
            .join(" • ")}
        </div>

        <div className="mt-2 flex min-h-[34px] items-center justify-between gap-1">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-gray-950 sm:text-lg">
              {priceLabel(product.price)}
            </p>
            {numberValue(product.originalPrice) > numberValue(product.price) && (
              <p className="text-[8px] text-gray-400 line-through sm:text-[10px]">
                {priceLabel(product.originalPrice)}
              </p>
            )}
          </div>
          <span
            className={`shrink-0 rounded-full px-1.5 py-1 text-[7px] font-bold sm:px-2 sm:text-[9px] ${
              stock > 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {stock > 0 ? "In Stock" : "Sold Out"}
          </span>
        </div>

        {stock > 0 ? (
          <Link
            href={getProductHref(product)}
            className="mt-2.5 flex h-8 w-full items-center justify-center gap-1 rounded-lg bg-black text-[10px] font-bold text-white transition hover:bg-gray-800 sm:mt-3 sm:h-10 sm:rounded-xl sm:text-xs"
          >
            Buy Now
            <ArrowRight size={12} />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="mt-2.5 h-8 w-full cursor-not-allowed rounded-lg bg-gray-200 text-[10px] font-bold text-gray-500 sm:mt-3 sm:h-10 sm:rounded-xl sm:text-xs"
          >
            Currently Unavailable
          </button>
        )}
      </div>
    </motion.article>
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
  loading,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: HomeProduct[];
  loading: boolean;
}) {
  const visible = products.slice(0, 4);

  return (
    <section className="bg-white px-3 py-6 sm:px-4 sm:py-8 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-black sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 max-w-md text-xs text-gray-500 sm:text-sm">
              {description}
            </p>
          </div>
          <Link
            href="/buy"
            className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-[10px] font-bold text-black transition hover:border-black hover:bg-black hover:text-white sm:text-xs"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white"
              >
                <div className="h-[150px] bg-gray-100 sm:h-[210px]" />
                <div className="space-y-3 p-3">
                  <div className="h-3 w-1/3 rounded bg-gray-100" />
                  <div className="h-4 w-4/5 rounded bg-gray-100" />
                  <div className="h-7 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {visible.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
            <Smartphone size={34} className="mx-auto text-gray-300" />
            <p className="mt-3 text-sm font-semibold text-gray-600">
              No phones are available right now.
            </p>
            <Link
              href="/buy"
              className="mt-3 inline-flex text-xs font-bold text-black underline"
            >
              Browse the shop
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   FULL-WIDTH PROMO BANNER
========================================================= */

function PromoBanner() {
  return (
    <section className="w-full overflow-hidden bg-black">
      <div className="relative h-[140px] w-full sm:h-[180px] lg:h-[210px]">
        <Image
          src={heroBanners[1].image}
          alt="Your next phone. Better value."
          fill
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/40 to-black/70" />

        <div className="absolute inset-0 flex items-center justify-end px-5 sm:px-10 lg:px-16">
          <div className="text-right text-white">
            <h2 className="text-xl font-black leading-tight sm:text-3xl lg:text-4xl">
              Your next phone.
              <br />
              <span className="text-indigo-300">Better value.</span>
            </h2>
            <Link href="/buy" className={`${shopButtonClass} mt-3 sm:mt-4`}>
              Shop Now
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WHY PHONEBHAI
========================================================= */

const valueFeatures = [
  {
    icon: ShieldCheck,
    title: "Quality Checked",
    description: "Devices checked before being listed.",
  },
  {
    icon: Wallet,
    title: "Honest Pricing",
    description: "Clear prices and product information.",
  },
  {
    icon: Truck,
    title: "Secure Delivery",
    description: "Carefully packed and delivered to you.",
  },
  {
    icon: Recycle,
    title: "Second Life",
    description: "Giving smartphones another useful life.",
  },
];

function WhyPhoneBhai() {
  return (
    <section className="bg-white px-3 py-8 sm:px-5 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.8fr] lg:items-center lg:gap-10">
        <div>
          <span className="inline-flex rounded-full border border-gray-200 px-3 py-1.5 text-[9px] font-bold text-gray-700 sm:text-[10px]">
            Why PhoneBhai
          </span>
          <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-black sm:text-3xl lg:text-4xl">
            Refurbished phones
            <span className="block text-indigo-600">Better value.</span>
          </h2>
          <p className="mt-3 max-w-sm text-xs leading-6 text-gray-500 sm:text-sm">
            Quality-focused devices, fair prices and a smarter way to upgrade.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {valueFeatures.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-4 text-center transition hover:border-gray-400 hover:shadow-md sm:min-h-[155px] sm:rounded-2xl sm:px-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-black sm:h-12 sm:w-12">
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <h3 className="mt-3 text-[11px] font-bold text-gray-950 sm:text-sm">
                {title}
              </h3>
              <p className="mt-1 text-[9px] leading-4 text-gray-500 sm:text-[10px]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PHONEBHAI CYCLE
========================================================= */

function PhoneBhaiCycle() {
  return (
    <section className="bg-white px-3 pb-8 sm:px-5 sm:pb-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-black px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative grid gap-7 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 sm:text-[10px]">
                The PhoneBhai cycle
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
                From your old phone
                <span className="block text-indigo-300">
                  to someone&apos;s next phone.
                </span>
              </h2>
              <p className="mt-3 max-w-lg text-xs leading-6 text-white/65 sm:text-sm">
                A good smartphone deserves more than one owner. PhoneBhai makes
                it easier to discover quality-focused pre-owned phones at better
                prices.
              </p>
              <Link
                href="/buy"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black text-black transition hover:bg-gray-200"
              >
                Explore phones
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4">
                <Recycle size={24} className="text-indigo-300" />
                <h3 className="mt-3 text-sm font-black text-white">Less waste</h3>
                <p className="mt-1 text-[10px] leading-5 text-white/55">
                  Extend the useful life of smartphones.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4">
                <Wallet size={24} className="text-indigo-300" />
                <h3 className="mt-3 text-sm font-black text-white">More value</h3>
                <p className="mt-1 text-[10px] leading-5 text-white/55">
                  Find better value when upgrading.
                </p>
              </div>
              <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.07] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
                    <Smartphone size={21} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white sm:text-sm">
                      Smartphones, made smarter
                    </h3>
                    <p className="mt-1 text-[10px] text-white/55">
                      Discover phones for your next upgrade.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TRUST STRIP
========================================================= */

function TrustStrip() {
  const items = [
    { icon: ShieldCheck, title: "Quality focused" },
    { icon: BadgeCheck, title: "Transparent details" },
    { icon: Truck, title: "Secure delivery" },
    { icon: PackageCheck, title: "Warranty support" },
  ];

  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-4 sm:divide-y-0">
        {items.map(({ icon: Icon, title }) => (
          <div
            key={title}
            className="flex items-center justify-center gap-2 px-2 py-3 sm:py-4"
          >
            <Icon size={16} className="shrink-0 text-gray-800" />
            <span className="text-[9px] font-bold text-gray-700 sm:text-xs">
              {title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   STATIC REVIEWS
========================================================= */

function ReviewsSection() {
  return (
    <section className="bg-white px-3 py-10 sm:px-5 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-black sm:text-3xl">
              People who bought from us.
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Real customer experiences...
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {staticReviews.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
            >
              <div className="flex items-center gap-0.5 text-yellow-400">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={13} fill="currentColor" />
                ))}
              </div>
              <p className="mt-3 text-sm font-medium text-gray-800">
                “{r.comment}”
              </p>
              {r.sub && (
                <p className="mt-0.5 text-sm text-gray-500">{r.sub}</p>
              )}
              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  {r.name.charAt(0)}
                </div>
                <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function Home() {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts({
        page: 1,
        limit: 100,
        category: "Smartphones",
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setProducts(data as HomeProduct[]);
    } catch (err) {
      console.error("PhoneBhai homepage product fetch failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const response = await getProducts({
          page: 1,
          limit: 100,
          category: "Smartphones",
        });
        if (!active) return;
        setProducts(
          Array.isArray(response.data)
            ? (response.data as HomeProduct[])
            : [],
        );
        setError(null);
      } catch (err) {
        if (!active) return;
        console.error("PhoneBhai homepage product fetch failed:", err);
        setError(
          err instanceof Error ? err.message : "Unable to load products.",
        );
      } finally {
        if (active) setLoading(false);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, []);

  const freshArrivals = useMemo(() => products.slice(0, 4), [products]);

  const bestDeals = useMemo(
    () =>
      [...products]
        .sort((a, b) => getSaving(b) - getSaving(a))
        .slice(0, 4),
    [products],
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-black">
      <HeroSlider />

      {/* Seamless infinite brand logos (right → left) */}
      <BrandLogos />

      <ProductSection
        eyebrow="New inventory"
        title="Fresh Arrivals"
        description="The latest smartphones added to our store."
        products={freshArrivals}
        loading={loading}
      />

      <PromoBanner />

      <ProductSection
        eyebrow="Better value"
        title="Best deals right now"
        description="Find phones where the current price gives you the biggest saving."
        products={bestDeals}
        loading={loading}
      />

      <WhyPhoneBhai />
      <PhoneBhaiCycle />
      <TrustStrip />
      <ReviewsSection />

      {!loading && error && (
        <section className="bg-white px-5 pb-10">
          <div className="mx-auto max-w-xl rounded-xl border border-red-100 bg-red-50 p-5 text-center">
            <p className="text-sm font-bold text-red-700">
              We couldn&apos;t refresh the live product inventory.
            </p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
            <button
              type="button"
              onClick={loadProducts}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-bold text-white"
            >
              <RefreshCw size={13} />
              Try again
            </button>
            <Link
              href="/buy"
              className="ml-3 inline-flex items-center text-xs font-bold text-black underline"
            >
              Open shop
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}