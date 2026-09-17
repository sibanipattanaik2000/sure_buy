"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Heart,
  MapPin,
  ShieldCheck,
  Smartphone,
  Star,
  Truck,
  Wallet,
  ShoppingCart,
} from "lucide-react";

import { useWishlist } from "../../context/WishlistContext";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useCart } from "../../context/CartContext";
import { getProduct } from "@/app/lib/api";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/app/lib/image";
/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.phonebhai.com/api/v1";

/* =========================================================
   TYPES
========================================================= */

type ApiImage = {
  id: number;
  url: string;
  key?: string | null;
  altText?: string | null;
  type: "IMAGE" | "VIDEO";
  mimeType?: string | null;
  size?: number | null;
  position: number;
};

type ApiVariant = {
  id: number;
  productId: number;
  storage: string;
  color: string;
  colorHex?: string | null;
  price: number | string;
  originalPrice: number | string;
  stock: number;
  images: ApiImage[];
};

type ApiReviewMedia = {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  size: number;
  type: "IMAGE" | "VIDEO";
  position: number;
  createdAt: string;
};

type ApiReview = {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  media?: ApiReviewMedia[];
};

type ApiProduct = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  category: string;
  condition: "EXCELLENT" | "LIKE_NEW" | "GOOD";
  price: number | string;
  originalPrice: number | string;
  warranty: string;
  description: string;
  rating: number | string;
  reviewCount: number;
  emiFrom: number | string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;

  variants: ApiVariant[];
  images: ApiImage[];

  highlights: {
    id: number;
    productId: number;
    text: string;
    position: number;
  }[];

  /*
   * IMPORTANT:
   * This is the ONLY reviews property.
   * The previous duplicate declaration is removed.
   */
  reviews: ApiReview[];
};

/* =========================================================
   API RESPONSE
========================================================= */

type ProductApiResponse = {
  success?: boolean;
  data?: ApiProduct;
  message?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function formatPrice(value: number | string | null | undefined): string {
  return toNumber(value).toLocaleString("en-IN");
}

function formatCondition(condition: ApiProduct["condition"]): string {
  switch (condition) {
    case "LIKE_NEW":
      return "Like New";

    case "EXCELLENT":
      return "Excellent";

    case "GOOD":
      return "Good";

    default:
      return condition;
  }
}

function safeReviews(reviews: ApiReview[] | null | undefined): ApiReview[] {
  return Array.isArray(reviews) ? reviews : [];
}

function safeImages(images: ApiImage[] | null | undefined): ApiImage[] {
  return Array.isArray(images) ? images : [];
}

function sortImages(images: ApiImage[]): ApiImage[] {
  return [...images].sort((a, b) => a.position - b.position);
}
function normalizeStorage(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function normalizeColor(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}
function getRatingColor(rating: number): string {
  if (rating >= 4) {
    return "text-green-600";
  }

  if (rating >= 3) {
    return "text-yellow-500";
  }

  return "text-red-500";
}

function getRatingBgColor(rating: number): string {
  if (rating >= 4) {
    return "bg-green-600";
  }

  if (rating >= 3) {
    return "bg-yellow-500";
  }

  return "bg-red-500";
}
/* =====  ====================================================
   PAGE
========================================================= */

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const productIdentifier = params?.id;

  /* =======================================================
     CONTEXTS
  ======================================================= */

  const { setProduct, setPaymentMethod } = useCheckout();

  const { addToCart, isInCart, cartItems } = useCart();

  const { wishlist, toggleWishlist } = useWishlist();

  /* =======================================================
     STATE
  ======================================================= */

  const [product, setProductData] = useState<ApiProduct | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [selectedStorage, setSelectedStorage] = useState("");

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);

  const [paymentMethod, setPaymentMethodState] = useState("upi");

  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    if (!product || product.variants.length === 0) {
      return;
    }

    const firstVariant = product.variants[0];

    setSelectedStorage(firstVariant.storage);
    setSelectedColor(firstVariant.color);
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);
  /* =======================================================
     FETCH PRODUCT + REVIEWS
  ======================================================= */


useEffect(() => {
  if (!productIdentifier) {
    return;
  }

  let cancelled = false;

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const decodedIdentifier = decodeURIComponent(productIdentifier);

      /* -----------------------------------------------
         PRODUCT
         ----------------------------------------------- */
      const response = await getProduct<ApiProduct>(decodedIdentifier);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load product");
      }

      if (cancelled) {
        return;
      }

      const productData = response.data;

      /*
       * Render the product immediately.
       * Do NOT wait for the reviews API.
       */
      setProductData({
        ...productData,
        reviews: safeReviews(productData.reviews),
        rating: toNumber(productData.rating),
      });

      setLoading(false);

      /* -----------------------------------------------
         REVIEWS
         Load separately in the background.
         ----------------------------------------------- */
      try {
        const reviewsResponse = await fetch(
          `${API_BASE_URL}/products/${productData.id}/reviews?page=1&limit=10`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        if (!reviewsResponse.ok || cancelled) {
          return;
        }

        const reviewsPayload = await reviewsResponse.json();

        const reviews: ApiReview[] =
          Array.isArray(reviewsPayload?.reviews)
            ? reviewsPayload.reviews
            : Array.isArray(reviewsPayload?.data?.reviews)
              ? reviewsPayload.data.reviews
              : Array.isArray(reviewsPayload?.data)
                ? reviewsPayload.data
                : [];

        if (cancelled || reviews.length === 0) {
          return;
        }

        const calculatedRating =
          reviews.reduce(
            (sum: number, review: ApiReview) =>
              sum + toNumber(review.rating),
            0,
          ) / reviews.length;

        setProductData((current) =>
          current
            ? {
                ...current,
                reviews,
                rating: Number(calculatedRating.toFixed(1)),
                reviewCount: reviews.length,
              }
            : current,
        );
      } catch (reviewError) {
        /*
         * Reviews are non-blocking.
         * The product page should remain usable even
         * when the reviews request fails.
         */
        console.error("FAILED TO FETCH REVIEWS:", reviewError);
      }
    } catch (error) {
      if (cancelled) {
        return;
      }

      console.error("FAILED TO FETCH PRODUCT:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load product",
      );

      setLoading(false);
    }
  };

  fetchProductAndReviews();

  return () => {
    cancelled = true;
  };
}, [productIdentifier]);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 px-5 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Smartphone size={26} />
          </div>

          <h1 className="mt-5 text-2xl font-black">Product not found</h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error || "The product you're looking for is no longer available."}
          </p>

          <Link
            href="/buy"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  /* =======================================================
     PRODUCT VALUES
  ======================================================= */

  const productPrice = toNumber(product.price);

  const productOriginalPrice = toNumber(product.originalPrice);

  const reviewRatings = safeReviews(product.reviews);

  const calculatedReviewRating =
    reviewRatings.length > 0
      ? reviewRatings.reduce(
          (total, review) => total + toNumber(review.rating),
          0,
        ) / reviewRatings.length
      : toNumber(product.rating);

  const productRating = calculatedReviewRating;

  const emiPrice =
    product.emiFrom !== null && product.emiFrom !== undefined
      ? toNumber(product.emiFrom)
      : Math.ceil(productPrice / 12);

  const discount =
    productOriginalPrice > 0
      ? Math.max(
          0,
          Math.round(
            ((productOriginalPrice - productPrice) / productOriginalPrice) *
              100,
          ),
        )
      : 0;

  /* =======================================================
   AVAILABLE OPTIONS
======================================================= */

  /*
   * Storage is normalized so:
   * "256GB"
   * "256 GB"
   * "256gb"
   *
   * are treated as the same storage.
   */
  const storageOptions = Array.from(
    new Map(
      product.variants
        .filter((variant) => variant.storage?.trim())
        .map((variant) => [
          normalizeStorage(variant.storage),
          variant.storage.trim(),
        ]),
    ).values(),
  );

  /*
   * Colours remain unique by their actual normalized value.
   */
  const colorOptions = Array.from(
    new Map(
      product.variants
        .filter((variant) => variant.color?.trim())
        .map((variant) => [
          normalizeColor(variant.color),
          variant.color.trim(),
        ]),
    ).values(),
  );

  /*
   * Colours available for the currently selected storage.
   */

  /*
   * Storage options available for the currently selected colour.
   */
  const availableColorsForStorage = new Set(
    product.variants
      .filter(
        (variant) =>
          normalizeStorage(variant.storage) ===
          normalizeStorage(selectedStorage),
      )
      .map((variant) => normalizeColor(variant.color)),
  );

  /* =======================================================
     ACTIVE VARIANT
  ======================================================= */
  const activeVariant =
    product.variants.find(
      (variant) =>
        normalizeStorage(variant.storage) ===
          normalizeStorage(selectedStorage) &&
        normalizeColor(variant.color) === normalizeColor(selectedColor),
    ) ||
    product.variants.find(
      (variant) =>
        normalizeStorage(variant.storage) === normalizeStorage(selectedStorage),
    ) ||
    product.variants.find(
      (variant) =>
        normalizeColor(variant.color) === normalizeColor(selectedColor),
    ) ||
    product.variants[0];

  /* =======================================================
     ACTIVE PRICING
  ======================================================= */

  const activePrice = activeVariant
    ? toNumber(activeVariant.price)
    : productPrice;

  const activeOriginalPrice = activeVariant
    ? toNumber(activeVariant.originalPrice)
    : productOriginalPrice;

  const activeDiscount =
    activeOriginalPrice > 0
      ? Math.max(
          0,
          Math.round(
            ((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100,
          ),
        )
      : discount;

  /* =======================================================
     GALLERY
     
     IMPORTANT:
     Images + videos are both retained.
     Variant media has priority over product media.
  ======================================================= */

  /* =========================================================
   GALLERY
========================================================= */

  const variantGallery = activeVariant
    ? sortImages(safeImages(activeVariant.images))
    : [];

  const productGallery = sortImages(safeImages(product.images));

  /*
   * Variant images/videos take priority.
   * If the selected variant has media, show only that media.
   * Otherwise fall back to product-level media.
   */
  const gallery = variantGallery.length > 0 ? variantGallery : productGallery;

  /*
   * Keep selected index safe even if the gallery changes
   * because storage/color was changed.
   */
  const safeImageIndex =
    gallery.length > 0
      ? Math.min(Math.max(selectedImage, 0), gallery.length - 1)
      : 0;

  const activeMedia = gallery[safeImageIndex];

  /* =======================================================
     WISHLIST
  ======================================================= */

  const wishlistProduct = {
    id: String(product.id),
    name: product.name,
    brand: product.brand,
    price: activePrice,
    image:
      gallery.find((media) => media.type === "IMAGE")?.url ||
      activeMedia?.url ||
      "",
    storage: activeVariant?.storage || selectedStorage || undefined,
  };

  const liked = wishlist.some((item) => item.id === String(product.id));

  /* =======================================================
     CART
  ======================================================= */

  const currentStorage = activeVariant?.storage || selectedStorage || "";

  const currentColor = activeVariant?.color || selectedColor || "";

  const currentVariantInCart = isInCart(
    String(product.id),
    currentStorage,
    currentColor,
  );

  const existingCartItem = cartItems.find(
    (item) =>
      item.id === String(product.id) &&
      item.storage === currentStorage &&
      item.color === currentColor,
  );

  const existingCartQuantity = existingCartItem?.quantity || 0;

  const remainingStock = Math.max(
    0,
    (activeVariant?.stock || 0) - existingCartQuantity,
  );

  const cartProduct = {
    id: String(product.id),

    // IMPORTANT: send the selected variant to backend
    variantId: activeVariant?.id ?? null,

    name: product.name,
    brand: product.brand,
    category: product.category,
    storage: currentStorage,
    color: currentColor,
    condition: formatCondition(product.condition),
    price: activePrice,
    originalPrice: activeOriginalPrice,
    warranty: product.warranty,
    image:
      gallery.find((media) => media.type === "IMAGE")?.url ||
      activeMedia?.url ||
      "",
  };

  /* =======================================================
     STORAGE CHANGE
  ======================================================= */

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    setSelectedImage(0);

    const matchingVariant =
      product.variants.find(
        (variant) =>
          normalizeStorage(variant.storage) === normalizeStorage(storage) &&
          normalizeColor(variant.color) === normalizeColor(selectedColor),
      ) ||
      product.variants.find(
        (variant) =>
          normalizeStorage(variant.storage) === normalizeStorage(storage),
      );

    if (matchingVariant) {
      setSelectedColor(matchingVariant.color);

      setQuantity((current) =>
        Math.min(Math.max(1, current), Math.max(1, matchingVariant.stock)),
      );
    }
  };

  /* =======================================================
     COLOR CHANGE
  ======================================================= */

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedImage(0);

    const matchingVariant =
      product.variants.find(
        (variant) =>
          normalizeColor(variant.color) === normalizeColor(color) &&
          normalizeStorage(variant.storage) ===
            normalizeStorage(selectedStorage),
      ) ||
      product.variants.find(
        (variant) => normalizeColor(variant.color) === normalizeColor(color),
      );

    if (matchingVariant) {
      // Keep the selected storage as the canonical value
      // already shown in the storage options.
      const matchingStorageOption = storageOptions.find(
        (storage) =>
          normalizeStorage(storage) ===
          normalizeStorage(matchingVariant.storage),
      );

      setSelectedStorage(matchingStorageOption || matchingVariant.storage);

      setQuantity((current) =>
        Math.min(Math.max(1, current), Math.max(1, matchingVariant.stock)),
      );
    }
  };

  /* =======================================================
     STOCK
  ======================================================= */

  const stock = activeVariant?.stock ?? 0;

  const isOutOfStock = stock <= 0;

  /*
   * If the entire available stock is already
   * in the cart, don't allow another addition.
   */
  const cannotAddMore =
    isOutOfStock || remainingStock <= 0 || quantity > remainingStock;

  /* =======================================================
     QUANTITY
  ======================================================= */

  const handleIncreaseQuantity = () => {
    if (isOutOfStock) {
      return;
    }

    setQuantity((current) => Math.min(stock, current + 1));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  /*
   * Unit price stays unchanged in the product
   * price card.
   *
   * This is the actual selected quantity total.
   */
  const selectedQuantityTotal = activePrice * quantity;

  const selectedQuantitySavings = Math.max(
    0,
    (activeOriginalPrice - activePrice) * quantity,
  );

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = () => {
    if (!activeVariant) {
      return;
    }

    if (isOutOfStock) {
      return;
    }

    if (quantity <= 0) {
      return;
    }

    if (quantity > remainingStock) {
      return;
    }

    addToCart(cartProduct, quantity);
  };

  /* =======================================================
     BUY NOW
  ======================================================= */

  const handleBuyNow = () => {
    if (!activeVariant) {
      return;
    }

    if (isOutOfStock) {
      return;
    }

    if (quantity > stock || quantity <= 0) {
      return;
    }

    /*
     * Persist selected payment method.
     */
    setPaymentMethod(paymentMethod);

    /*
     * Quantity is explicitly included.
     * CheckoutContext will normalize it.
     */
    setProduct(
      {
        ...cartProduct,
        quantity,
      },
      currentStorage,
      currentColor,
    );

    router.push("/checkout");
  };

  /* =======================================================
     PAYMENT CHANGE
  ======================================================= */

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethodState(method);
    setPaymentMethod(method);
  };
  /* =========================================================
   SELECT MEDIA
========================================================= */

  const handleMediaSelect = (index: number) => {
    if (index < 0 || index >= gallery.length) {
      return;
    }

    setSelectedImage(index);
  };
  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          {/* =================================================
              LEFT IMAGE SECTION
          ================================================= */}

          <div>
            {/* MAIN IMAGE / VIDEO */}

            <div className="relative flex min-h-[520px] items-center justify-center rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
              {activeDiscount > 0 && (
                <span className="absolute left-5 top-5 z-20 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white">
                  {activeDiscount}% OFF
                </span>
              )}

              {/* WISHLIST */}

              <button
                type="button"
                onClick={() => toggleWishlist(wishlistProduct)}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className={`absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition ${
                  liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart size={20} fill={liked ? "currentColor" : "none"} />
              </button>

              {/* PRODUCT MEDIA */}

              {/* =========================================================
    ACTIVE PRODUCT MEDIA
========================================================= */}

              <div className="flex h-full w-full items-center justify-center">
                {activeMedia?.url ? (
                  activeMedia.type === "VIDEO" ? (
                    <video
                      key={`video-${activeMedia.id}-${activeMedia.url}`}
src={getOptimizedImageUrl(activeMedia.url, 900, 80)}
                      controls
                      playsInline
                      preload="metadata"
                      className="max-h-[420px] max-w-[85%] rounded-2xl object-contain"
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <Image
  key={`image-${activeMedia.id}-${activeMedia.url}`}
  src={getOptimizedImageUrl(activeMedia.url, 900, 80)}
  alt={
    activeMedia.altText ||
    `${product.name}${activeVariant ? ` ${activeVariant.color}` : ""}`
  }
  width={700}
  height={700}
  priority
  sizes="(max-width: 1024px) 90vw, 700px"
  className="max-h-[420px] max-w-[85%] object-contain transition duration-500 hover:scale-105"
/>
                  )
                ) : (
                  <div className="flex h-[380px] items-center justify-center text-gray-300">
                    <Smartphone size={80} />
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================
    IMAGE / VIDEO THUMBNAILS
========================================================= */}

            {gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {gallery.map((media, index) => {
                  const isActive = safeImageIndex === index;

                  return (
                    <button
                      key={`${media.id}-${media.url}-${index}`}
                      type="button"
                      onClick={() => handleMediaSelect(index)}
                      aria-label={`View ${
                        media.type === "VIDEO" ? "video" : "image"
                      } ${index + 1}`}
                      aria-pressed={isActive}
                      className={`relative flex h-24 items-center justify-center overflow-hidden rounded-2xl border bg-white p-2 transition-all duration-200 ${
                        isActive
                          ? "border-2 border-indigo-600 ring-2 ring-indigo-100"
                          : "border-gray-200 hover:border-indigo-400"
                      }`}
                    >
                      {/* IMAGE THUMBNAIL */}
                      {media.type === "IMAGE" ? (
                        <Image
src={getOptimizedImageUrl(media.url, 240, 72)}                          alt={
                            media.altText ||
                            `${product.name} thumbnail ${index + 1}`
                          }
                          width={160}
                          height={96}
                          sizes="160px"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        /* VIDEO THUMBNAIL */
                        <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                          <video
                            key={`thumbnail-video-${media.id}`}
                            src={media.url}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />

                          {/* DARK OVERLAY */}
                          <div className="absolute inset-0 bg-black/20" />

                          {/* PLAY BUTTON */}
                          <span className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md">
                            <span className="ml-0.5 text-sm">▶</span>
                          </span>

                          {/* VIDEO LABEL */}
                          <span className="absolute left-1.5 top-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                            VIDEO
                          </span>
                        </div>
                      )}

                      {/* ACTIVE CHECK */}
                      {isActive && (
                        <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white shadow">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TRUST */}

            <div className="mt-5 grid grid-cols-3 gap-3">
              <InfoBox
                icon={<ShieldCheck size={19} />}
                title="Quality checked"
              />

              <InfoBox
                icon={<BadgeCheck size={19} />}
                title={product.warranty || "Warranty backed"}
              />

              <InfoBox icon={<Truck size={19} />} title="Fast delivery" />
            </div>
          </div>

          {/* =================================================
              RIGHT PRODUCT DETAILS
          ================================================= */}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              {product.brand}
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white ${getRatingBgColor(
                  productRating,
                )}`}
              >
                {productRating.toFixed(1)}
                <Star size={12} fill="currentColor" />
              </div>

              <span className="text-sm text-gray-500">
                {product.reviewCount} reviews
              </span>

              <span className="text-gray-300">•</span>

              <span className="text-sm font-semibold text-gray-500">
                {formatCondition(product.condition)} condition
              </span>
            </div>

            {/* DESCRIPTION */}

            <p className="mt-6 text-sm leading-7 text-gray-500">
              {product.description}
            </p>

            {/* PRICE */}

            <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black">
                  ₹{formatPrice(activePrice * quantity)}
                </span>

                {activeOriginalPrice > activePrice && (
                  <>
                    <span className="mb-1 text-sm text-gray-400 line-through">
                      ₹{formatPrice(activeOriginalPrice * quantity)}
                    </span>

                    <span className="mb-1 text-sm font-bold text-green-600">
                      Save ₹
                      {formatPrice(
                        (activeOriginalPrice - activePrice) * quantity,
                      )}
                    </span>
                  </>
                )}
              </div>

              {/* QUANTITY TOTAL */}

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3">
                <CreditCard size={18} className="text-indigo-600" />

                <p className="text-xs font-semibold text-indigo-700">
                  EMI available from ₹{formatPrice(emiPrice)}
                  /month for 12 months
                </p>
              </div>
            </div>

            {/* STORAGE */}

            {storageOptions.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-bold">Storage</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {storageOptions.map((storage) => {
                    const isAvailable = product.variants.some(
                      (variant) =>
                        normalizeStorage(variant.storage) ===
                          normalizeStorage(storage) && variant.stock > 0,
                    );

                    const isSelected =
                      normalizeStorage(selectedStorage) ===
                      normalizeStorage(storage);

                    return (
                      <button
                        key={normalizeStorage(storage)}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => handleStorageChange(storage)}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                            : isAvailable
                              ? "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                              : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                        }`}
                      >
                        {storage}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* COLOR */}
            <div className="mt-2">
              {/* COLOR */}
              {colorOptions.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-bold">Colour</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {colorOptions.map((color) => {
                      const matchingVariant =
                        product.variants.find(
                          (variant) =>
                            normalizeColor(variant.color) ===
                              normalizeColor(color) &&
                            normalizeStorage(variant.storage) ===
                              normalizeStorage(selectedStorage),
                        ) ||
                        product.variants.find(
                          (variant) =>
                            normalizeColor(variant.color) ===
                            normalizeColor(color),
                        );

                      const isAvailable =
                        !selectedStorage ||
                        availableColorsForStorage.has(normalizeColor(color));

                      const isSelected =
                        normalizeColor(selectedColor) === normalizeColor(color);

                      const colorHex = matchingVariant?.colorHex;

                      return (
                        <button
                          key={color}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => handleColorChange(color)}
                          aria-label={`Select ${color}`}
                          aria-pressed={isSelected}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50 text-gray-900"
                              : isAvailable
                                ? "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                                : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                          }`}
                        >
                          <span
                            className={`h-5 w-5 shrink-0 rounded-full border border-gray-300 ${
                              !isAvailable ? "opacity-40" : ""
                            }`}
                            style={{
                              backgroundColor: colorHex || "#E5E7EB",
                            }}
                          />

                          <span>{color}</span>

                          {isSelected && (
                            <Check size={15} className="text-indigo-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* STOCK */}

            <div className="mt-5">
              {isOutOfStock ? (
                <p className="text-sm font-bold text-red-600">Out of stock</p>
              ) : (
                <p className="text-sm font-semibold text-green-600">
                  {stock} {stock === 1 ? "unit" : "units"} available
                </p>
              )}

              {existingCartQuantity > 0 && !isOutOfStock && (
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {existingCartQuantity} already in your cart
                </p>
              )}
            </div>

            {/* QUANTITY */}

            <div className="mt-6">
              <p className="text-sm font-bold">Quantity</p>

              <div className="mt-3 inline-flex h-11 items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={handleDecreaseQuantity}
                  aria-label="Decrease quantity"
                  className="flex h-full w-11 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-lg">−</span>
                </button>

                <span className="flex h-full min-w-12 items-center justify-center border-x border-gray-200 px-3 text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= stock}
                  onClick={handleIncreaseQuantity}
                  aria-label="Increase quantity"
                  className="flex h-full w-11 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            {/* DELIVERY */}

            <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <MapPin size={19} className="text-indigo-600" />

                <div>
                  <p className="text-sm font-bold">Check delivery</p>

                  <p className="mt-1 text-xs text-gray-500">
                    Enter your PIN code at checkout
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="mt-7">
              <h2 className="text-lg font-black">Choose payment method</h2>

              <div className="mt-4 grid gap-3">
                <PaymentOption
                  active={paymentMethod === "upi"}
                  onClick={() => handlePaymentMethodChange("upi")}
                  icon={<Wallet size={19} />}
                  title="UPI"
                  description="Google Pay, PhonePe, Paytm and more"
                />

                <PaymentOption
                  active={paymentMethod === "card"}
                  onClick={() => handlePaymentMethodChange("card")}
                  icon={<CreditCard size={19} />}
                  title="Credit / Debit Card"
                  description="Secure card payment"
                />

                <PaymentOption
                  active={paymentMethod === "emi"}
                  onClick={() => handlePaymentMethodChange("emi")}
                  icon={<CreditCard size={19} />}
                  title="EMI"
                  description="Pay monthly with eligible cards"
                />

                <PaymentOption
                  active={paymentMethod === "cod"}
                  onClick={() => handlePaymentMethodChange("cod")}
                  icon={<Truck size={19} />}
                  title="Cash on Delivery"
                  description="Pay when your phone arrives"
                />
              </div>
            </div>

            {/* CART + BUY */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isOutOfStock || cannotAddMore}
                onClick={handleAddToCart}
                className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl border text-sm font-black transition ${
                  isOutOfStock || cannotAddMore
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    : currentVariantInCart
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-indigo-200 bg-white text-indigo-600 hover:border-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {isOutOfStock ? (
                  "Out of stock"
                ) : remainingStock <= 0 ? (
                  <>
                    <Check size={18} />
                    Maximum in cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    {currentVariantInCart ? "Add more to cart" : "Add to cart"}
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`group flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black text-white shadow-lg transition ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-gray-400 shadow-none"
                    : "bg-indigo-600 shadow-indigo-600/20 hover:-translate-y-0.5 hover:bg-indigo-700"
                }`}
              >
                Buy now
                {!isOutOfStock && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </div>

            {/* VIEW CART */}

            {currentVariantInCart && (
              <Link
                href="/cart"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-100 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                <ShoppingCart size={16} />
                View cart
              </Link>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
              <ShieldCheck size={15} className="text-green-600" />
              Secure payment • Warranty backed • Quality checked
            </div>
          </div>
        </div>

        {/* ===================================================
            PRODUCT INFORMATION
        =================================================== */}

        <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-black">Product details</h2>

          {product.highlights.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-green-600" />

                  <p className="text-sm font-semibold text-gray-700">
                    {highlight.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Detail title="Brand" value={product.brand} />

            <Detail title="Model" value={product.name} />

            <Detail
              title="Storage"
              value={activeVariant?.storage || selectedStorage || "—"}
            />

            <Detail
              title="Colour"
              value={activeVariant?.color || selectedColor || "—"}
            />

            <Detail
              title="Condition"
              value={formatCondition(product.condition)}
            />

            <Detail title="Warranty" value={product.warranty || "—"} />

            <Detail title="Rating" value={`${productRating.toFixed(1)}/5`} />

            <Detail title="Category" value={product.category || "—"} />
          </div>
        </section>

        {/* ===================================================
    CUSTOMER REVIEWS
=================================================== */}

        <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          {(() => {
            const reviews = safeReviews(product.reviews);

            const ratingCounts = {
              5: reviews.filter(
                (review) => Math.round(toNumber(review.rating)) === 5,
              ).length,
              4: reviews.filter(
                (review) => Math.round(toNumber(review.rating)) === 4,
              ).length,
              3: reviews.filter(
                (review) => Math.round(toNumber(review.rating)) === 3,
              ).length,
              2: reviews.filter(
                (review) => Math.round(toNumber(review.rating)) === 2,
              ).length,
              1: reviews.filter(
                (review) => Math.round(toNumber(review.rating)) === 1,
              ).length,
            };

            const totalRatings = reviews.length;

            const getBarWidth = (count: number) => {
              if (totalRatings === 0) {
                return 0;
              }

              return Math.round((count / totalRatings) * 100);
            };

            const ratingRows = [
              {
                rating: 5,
                count: ratingCounts[5],
                color: "bg-green-600",
              },
              {
                rating: 4,
                count: ratingCounts[4],
                color: "bg-green-500",
              },
              {
                rating: 3,
                count: ratingCounts[3],
                color: "bg-yellow-500",
              },
              {
                rating: 2,
                count: ratingCounts[2],
                color: "bg-red-500",
              },
              {
                rating: 1,
                count: ratingCounts[1],
                color: "bg-red-600",
              },
            ];

            return (
              <>
                {/* REVIEW HEADER */}

                <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                  <div className="min-w-[220px]">
                    <h2 className="text-2xl font-black">Customer reviews</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      See what verified customers say about this product.
                    </p>

                    <div className="mt-6 flex items-center gap-4">
                      <div className="text-center">
                        <p
                          className={`text-4xl font-black ${getRatingColor(
                            productRating,
                          )}`}
                        >
                          {productRating.toFixed(1)}
                        </p>

                        <div className="mt-1 flex items-center justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={16}
                              className={getRatingColor(productRating)}
                              fill={
                                index < Math.round(productRating)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>

                        <p className="mt-2 text-xs font-semibold text-gray-400">
                          {product.reviewCount}{" "}
                          {product.reviewCount === 1 ? "rating" : "ratings"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RATING BREAKDOWN */}

                  <div className="w-full max-w-xl flex-1 rounded-2xl bg-gray-50 p-5">
                    <div className="space-y-3">
                      {ratingRows.map((row) => (
                        <div
                          key={row.rating}
                          className="flex items-center gap-3"
                        >
                          {/* STAR NUMBER */}

                          <div className="flex w-8 shrink-0 items-center justify-end gap-1">
                            <span className="text-sm font-bold text-gray-700">
                              {row.rating}
                            </span>

                            <Star
                              size={13}
                              className={getRatingColor(row.rating)}
                              fill="currentColor"
                            />
                          </div>

                          {/* BAR */}

                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                              style={{
                                width: `${getBarWidth(row.count)}%`,
                              }}
                            />
                          </div>

                          {/* COUNT */}

                          <span className="w-8 text-right text-xs font-bold text-gray-500">
                            {row.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* REVIEWS */}

                <div className="mt-8 border-t border-gray-100 pt-8">
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => {
                        const reviewerName = review.user
                          ? `${review.user.firstName} ${review.user.lastName}`.trim()
                          : "Verified customer";

                        const reviewRating = Math.min(
                          5,
                          Math.max(0, toNumber(review.rating)),
                        );

                        const reviewDate = new Date(review.createdAt);

                        const validReviewDate = !Number.isNaN(
                          reviewDate.getTime(),
                        );

                        return (
                          <div
                            key={review.id}
                            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
                          >
                            {/* CUSTOMER + RATING */}

                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="text-sm font-bold text-gray-900">
                                  {reviewerName}
                                </p>

                                {review.verifiedPurchase && (
                                  <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-green-600">
                                    <BadgeCheck size={14} />
                                    Verified purchase
                                  </div>
                                )}
                              </div>

                              <div
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white ${getRatingBgColor(
                                  reviewRating,
                                )}`}
                              >
                                {reviewRating.toFixed(0)}

                                <Star size={12} fill="currentColor" />
                              </div>
                            </div>

                            {/* COMMENT */}

                            <p className="mt-4 text-sm leading-6 text-gray-600">
                              {review.comment}
                            </p>

                            {/* MEDIA */}

                            {review.media && review.media.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-3">
                                {review.media.map((media) =>
                                  media.type === "VIDEO" ? (
                                    <div
                                      key={media.id}
                                      className="overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm"
                                    >
                                      <video
                                        src={media.url}
                                        controls
                                        preload="metadata"
                                        className="h-32 w-32 object-cover sm:h-36 sm:w-36"
                                      />
                                    </div>
                                  ) : (
                                    <a
                                      key={media.id}
                                      href={media.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-sm"
                                    >
                                      <img
                                        src={media.url}
                                        alt="Customer review"
                                        className="h-32 w-32 object-cover transition duration-300 group-hover:scale-105 sm:h-36 sm:w-36"
                                      />
                                    </a>
                                  ),
                                )}
                              </div>
                            )}

                            {/* DATE */}

                            {validReviewDate && (
                              <p className="mt-4 text-xs text-gray-400">
                                {reviewDate.toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
                      <Star size={28} className="mx-auto text-gray-300" />

                      <h3 className="mt-3 text-sm font-black text-gray-900">
                        No reviews yet
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Verified customer reviews will appear here after
                        customers review this product.
                      </p>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </section>

        {/* ===================================================
            HOW IT WORKS
        =================================================== */}

        <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-black">Buy with confidence</h2>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <Step
              number="01"
              icon={<Smartphone size={20} />}
              title="Choose your phone"
              text="Select your preferred storage, colour and payment option."
            />

            <Step
              number="02"
              icon={<ShieldCheck size={20} />}
              title="Secure checkout"
              text="Complete your payment through our secure checkout process."
            />

            <Step
              number="03"
              icon={<Truck size={20} />}
              title="Get it delivered"
              text="Your quality-checked phone is packed and delivered safely."
            />
          </div>
        </section>
      </section>
    </main>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 text-center">
      <div className="text-indigo-600">{icon}</div>

      <p className="mt-2 text-[11px] font-bold text-gray-600">{title}</p>
    </div>
  );
}

/* =========================================================
   PAYMENT OPTION
========================================================= */

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        active
          ? "border-indigo-600 bg-indigo-50"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>

        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          active ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
        }`}
      >
        {active && <Check size={12} className="text-white" />}
      </div>
    </button>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function Detail({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-semibold text-gray-400">{title}</p>

      <p className="mt-1 text-sm font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* =========================================================
   STEP
========================================================= */

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="relative rounded-2xl bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
          {icon}
        </div>

        <span className="text-xs font-black text-gray-300">{number}</span>
      </div>

      <h3 className="mt-5 font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
    </div>
  );
}
