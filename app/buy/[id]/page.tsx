"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  CreditCard,
  Gift,
  Heart,
  MapPin,
  ShieldCheck,
  Smartphone,
  Star,
  Truck,
  ShoppingCart,
  Wallet,
  Clock3,
} from "lucide-react";

import { useWishlist } from "../../context/WishlistContext";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useCart } from "../../context/CartContext";
import { getProduct, getProducts } from "@/app/lib/api";
import Image from "next/image";
import { getOptimizedImageUrl } from "@/app/lib/image";
import { useAuth } from "@/app/context/AuthContext";

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
  reviews: ApiReview[];
};

type ProductListPayload = {
  success?: boolean;
  data?:
    | ApiProduct[]
    | {
        products?: ApiProduct[];
        items?: ApiProduct[];
      };
  products?: ApiProduct[];
  items?: ApiProduct[];
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
  if (rating >= 4) return "text-green-600";
  if (rating >= 3) return "text-yellow-500";
  return "text-red-500";
}

function getRatingBgColor(rating: number): string {
  if (rating >= 4) return "bg-green-600";
  if (rating >= 3) return "bg-yellow-500";
  return "bg-red-500";
}

function getProductList(payload: ProductListPayload): ApiProduct[] {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.data?.products)) {
    return payload.data.products;
  }

  if (Array.isArray(payload.data?.items)) {
    return payload.data.items;
  }

  if (Array.isArray(payload.products)) {
    return payload.products;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
}

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

/* =========================================================
   PAGE
========================================================= */

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const productIdentifier = params?.id;

  /* =======================================================
     CONTEXTS
  ======================================================= */

  const { setProduct } = useCheckout();

  const { addToCart, isInCart, cartItems } = useCart();

  const { wishlist, toggleWishlist } = useWishlist();

  const { isAuthenticated, loading: authLoading } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

  const [product, setProductData] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* New UI states */
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [similarProducts, setSimilarProducts] = useState<ApiProduct[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  /* Five-minute gift offer */
  const [giftSeconds, setGiftSeconds] = useState(300);
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  /* =======================================================
     VARIANT INITIALIZATION
  ======================================================= */

  useEffect(() => {
    if (!product || !product.variants?.length) return;

    const firstVariant = product.variants[0];

    setSelectedStorage(firstVariant.storage || "");
    setSelectedColor(firstVariant.color || "");
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);

  /* =======================================================
     GIFT COUNTDOWN

     Starts when this product page is opened.
     It does not restart on every React render.
  ======================================================= */

  useEffect(() => {
    if (!product) return;

    setGiftSeconds(300);

    const interval = window.setInterval(() => {
      setGiftSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [product?.id]);

  const giftOfferActive = giftSeconds > 0;

  /* =======================================================
     FETCH PRODUCT + REVIEWS

     Existing API fetching preserved.
  ======================================================= */

  useEffect(() => {
    if (!productIdentifier) return;

    let cancelled = false;

    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const decodedIdentifier = decodeURIComponent(productIdentifier);

        const response = await getProduct<ApiProduct>(decodedIdentifier);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Unable to load product");
        }

        if (cancelled) return;

        const productData = response.data;

        setProductData({
          ...productData,
          variants: Array.isArray(productData.variants)
            ? productData.variants
            : [],
          images: safeImages(productData.images),
          highlights: Array.isArray(productData.highlights)
            ? productData.highlights
            : [],
          reviews: safeReviews(productData.reviews),
          rating: toNumber(productData.rating),
        });

        setLoading(false);

        /* Existing separate reviews API */
        try {
          const API_URL =
            process.env.NEXT_PUBLIC_API_URL ||
            "https://api.phonebhai.com/api/v1";

          const reviewsResponse = await fetch(
            `${API_URL}/products/${productData.id}/reviews?page=1&limit=10`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
              cache: "no-store",
            },
          );

          if (!reviewsResponse.ok || cancelled) return;

          const reviewsPayload = await reviewsResponse.json();

          const reviews: ApiReview[] = Array.isArray(reviewsPayload?.reviews)
            ? reviewsPayload.reviews
            : Array.isArray(reviewsPayload?.data?.reviews)
              ? reviewsPayload.data.reviews
              : Array.isArray(reviewsPayload?.data)
                ? reviewsPayload.data
                : [];

          if (cancelled || reviews.length === 0) return;

          const calculatedRating =
            reviews.reduce(
              (sum: number, review: ApiReview) => sum + toNumber(review.rating),
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
          console.error("FAILED TO FETCH REVIEWS:", reviewError);
        }
      } catch (fetchError) {
        if (cancelled) return;

        console.error("FAILED TO FETCH PRODUCT:", fetchError);

        setError(
          fetchError instanceof Error
            ? fetchError.message
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
     SAME BRAND PRODUCTS

     Uses existing products listing API.
     Searches the brand and filters the results client-side.
     Does not introduce a backend endpoint.
  ======================================================= */

  useEffect(() => {
    if (!product?.brand) return;

    let cancelled = false;

    const fetchSimilarProducts = async () => {
      try {
        setSimilarLoading(true);

        const response = await getProducts({
          page: 1,
          limit: 100,
          search: product.brand,
        });

        if (cancelled) return;

        const payload = response as unknown as ProductListPayload;

        const products = getProductList(payload);

        const filteredProducts = products.filter(
          (item) =>
            item.active !== false &&
            String(item.id) !== String(product.id) &&
            item.brand?.trim().toLowerCase() ===
              product.brand.trim().toLowerCase(),
        );

        setSimilarProducts(filteredProducts);
      } catch (similarError) {
        console.error("FAILED TO FETCH SIMILAR PRODUCTS:", similarError);

        if (!cancelled) {
          setSimilarProducts([]);
        }
      } finally {
        if (!cancelled) {
          setSimilarLoading(false);
        }
      }
    };

    fetchSimilarProducts();

    return () => {
      cancelled = true;
    };
  }, [product?.id, product?.brand]);

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

  const productRating = calculatedReviewRating > 0 ? calculatedReviewRating : 5;

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

  /* =========================================================
     PRODUCT SEO STRUCTURED DATA
  ========================================================= */

  const seoImage =
    product.images?.find(
      (image) =>
        image.type === "IMAGE" &&
        typeof image.url === "string" &&
        image.url.length > 0,
    )?.url ||
    activeVariant?.images?.find(
      (image) =>
        image.type === "IMAGE" &&
        typeof image.url === "string" &&
        image.url.length > 0,
    )?.url;

  const productOffers = product.variants
    .map((variant) => {
      const price = toNumber(variant.price);

      if (price <= 0) return null;

      return {
        "@type": "Offer",
        url: `https://phonebhai.com/buy/${product.id}`,
        priceCurrency: "INR",
        price: price.toFixed(2),
        availability:
          Number(variant.stock || 0) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        itemCondition:
          product.condition === "LIKE_NEW"
            ? "https://schema.org/RefurbishedCondition"
            : "https://schema.org/UsedCondition",
        seller: {
          "@type": "Organization",
          name: "PhoneBhai",
          url: "https://phonebhai.com",
        },
      };
    })
    .filter((offer): offer is NonNullable<typeof offer> => offer !== null);

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.brand} ${product.name}`.trim(),
    description:
      product.description ||
      `Buy ${product.brand} ${product.name} at PhoneBhai.`,
    sku: String(product.id),
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    ...(seoImage ? { image: [seoImage] } : {}),
    ...(productOffers.length > 0
      ? {
          offers: productOffers.length === 1 ? productOffers[0] : productOffers,
        }
      : {}),
    ...(productRating > 0 && product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: productRating.toFixed(1),
            reviewCount: String(product.reviewCount),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
  };

  /* =======================================================
     GALLERY
  ======================================================= */

  const variantGallery = activeVariant
    ? sortImages(safeImages(activeVariant.images))
    : [];

  const productGallery = sortImages(safeImages(product.images));

  const gallery = variantGallery.length > 0 ? variantGallery : productGallery;

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

    // Gift eligibility is carried with the frontend cart item.
    giftOffer: giftOfferActive,
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

  const cannotAddMore =
    isOutOfStock || remainingStock <= 0 || quantity > remainingStock;

  /* =======================================================
     QUANTITY
  ======================================================= */

  const handleIncreaseQuantity = () => {
    if (isOutOfStock) return;

    setQuantity((current) => Math.min(stock, current + 1));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const selectedQuantityTotal = activePrice * quantity;

  const selectedQuantitySavings = Math.max(
    0,
    (activeOriginalPrice - activePrice) * quantity,
  );

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const handleAddToCart = () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;

      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);

      return;
    }

    if (!activeVariant || isOutOfStock) return;
    if (quantity <= 0 || quantity > remainingStock) return;

    addToCart(cartProduct, quantity);
  };

  /* =======================================================
     BUY NOW
  ======================================================= */

  const handleBuyNow = () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      const currentPath = window.location.pathname;

      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);

      return;
    }

    if (!activeVariant || isOutOfStock) return;
    if (quantity > stock || quantity <= 0) return;

    const checkoutProduct = {
      ...cartProduct,
      quantity,
      giftOffer: giftOfferActive,
    };

    setProduct(checkoutProduct, currentStorage, currentColor);

    router.push("/checkout");
  };

  /* =======================================================
     SELECT MEDIA
  ======================================================= */

  const handleMediaSelect = (index: number) => {
    if (index < 0 || index >= gallery.length) return;

    setSelectedImage(index);
  };
  const handleCheckDelivery = () => {
    const pincode = deliveryPincode.trim();

    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryError("Please enter a valid 6-digit PIN code.");
      setDeliveryEstimate(null);
      setDeliveryChecked(false);
      return;
    }

    setDeliveryError("");

    // Temporary UI estimate: 5 days.
    // This will be replaced with Shiprocket's actual estimate.
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);

    const weekday = estimatedDate.toLocaleDateString("en-IN", {
      weekday: "long",
    });

    const formattedDate = estimatedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

    setDeliveryEstimate(`${weekday}, ${formattedDate}`);
    setDeliveryChecked(true);
  };
  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8">
          {/* =================================================
              MAIN PRODUCT LAYOUT
          ================================================= */}

          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT IMAGE SECTION */}

            <div className="min-w-0">
              {/* MAIN IMAGE */}

              <div className="relative flex h-[390px] w-full items-center justify-center overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-3 shadow-sm sm:h-[480px] lg:h-[540px]">
                {activeDiscount > 0 && (
                  <span className="absolute left-5 top-5 z-20 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white">
                    {activeDiscount}% OFF
                  </span>
                )}

                {/* WISHLIST */}

                <button
                  type="button"
                  onClick={() => toggleWishlist(wishlistProduct)}
                  aria-label={
                    liked ? "Remove from wishlist" : "Add to wishlist"
                  }
                  className={`absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition ${
                    liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart size={20} fill={liked ? "currentColor" : "none"} />
                </button>

                {/* FILLED IMAGE AREA */}

                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
                  {activeMedia?.url ? (
                    activeMedia.type === "VIDEO" ? (
                      <video
                        key={`video-${activeMedia.id}-${activeMedia.url}`}
                        src={getOptimizedImageUrl(activeMedia.url, 900, 80)}
                        controls
                        playsInline
                        preload="metadata"
                        className="h-full w-full object-contain"
                      >
                        Your browser does not support video playback.
                      </video>
                    ) : (
                      <Image
                        key={`image-${activeMedia.id}-${activeMedia.url}`}
                        src={getOptimizedImageUrl(activeMedia.url, 900, 80)}
                        alt={
                          activeMedia.altText ||
                          `${product.name}${
                            activeVariant ? ` ${activeVariant.color}` : ""
                          }`
                        }
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-contain p-3 transition duration-500 hover:scale-[1.03]"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <Smartphone size={80} />
                    </div>
                  )}
                </div>
              </div>

              {/* IMAGE / VIDEO THUMBNAILS */}

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
                        className={`relative flex h-20 items-center justify-center overflow-hidden rounded-2xl border bg-white p-2 transition-all duration-200 sm:h-24 ${
                          isActive
                            ? "border-2 border-indigo-600 ring-2 ring-indigo-100"
                            : "border-gray-200 hover:border-indigo-400"
                        }`}
                      >
                        {media.type === "IMAGE" ? (
                          <Image
                            src={getOptimizedImageUrl(media.url, 240, 72)}
                            alt={
                              media.altText ||
                              `${product.name} thumbnail ${index + 1}`
                            }
                            width={160}
                            height={96}
                            sizes="160px"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                            <video
                              key={`thumbnail-video-${media.id}`}
                              src={media.url}
                              muted
                              playsInline
                              preload="metadata"
                              className="h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black/20" />

                            <span className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 shadow-md">
                              ▶
                            </span>

                            <span className="absolute left-1.5 top-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                              VIDEO
                            </span>
                          </div>
                        )}

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

            {/* RIGHT PRODUCT DETAILS */}

            <div className="min-w-0">
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

              {/* =================================================
                  COLLAPSIBLE DESCRIPTION
              ================================================= */}

              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setDescriptionOpen((current) => !current)}
                  aria-expanded={descriptionOpen}
                  className="flex w-full items-center justify-between gap-4 p-2 text-left"
                >
                  <div>
                    <p className="text-sm font-black">Product Description</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Know more about this device
                    </p>
                  </div>

                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-gray-500 transition-transform duration-300 ${
                      descriptionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    descriptionOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-gray-100 px-5 py-4">
                      <p className="text-sm leading-7 text-gray-600">
                        {product.description ||
                          `Explore the ${product.brand} ${product.name} at PhoneBhai. This device is quality checked and available in the selected condition and configuration.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRICE */}

              <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex flex-wrap items-end gap-3">
                  <span className="text-3xl font-black">
                    ₹{formatPrice(selectedQuantityTotal)}
                  </span>

                  {activeOriginalPrice > activePrice && (
                    <>
                      <span className="mb-1 text-sm text-gray-400 line-through">
                        ₹{formatPrice(activeOriginalPrice * quantity)}
                      </span>

                      <span className="mb-1 text-sm font-bold text-green-600">
                        Save ₹{formatPrice(selectedQuantitySavings)}
                      </span>
                    </>
                  )}
                </div>
                {/* 
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3">
                  <CreditCard
                    size={18}
                    className="shrink-0 text-indigo-600"
                  />

                  <p className="text-xs font-semibold text-indigo-700">
                    EMI available from ₹{formatPrice(emiPrice)}
                    /month for 12 months
                  </p>
                </div> */}
              </div>

              {/* =================================================
                  FIVE-MINUTE GIFT OFFER
              ================================================= */}

              <div
                className={`relative mt-5 overflow-hidden rounded-2xl border p-4 sm:p-5 ${
                  giftOfferActive
                    ? "border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50"
                    : "border-gray-200 bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-14 shrink-0 items-center justify-center rounded-2xl ${
                      giftOfferActive
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <Gift
                      size={30}
                      className={giftOfferActive ? "gift-vibrate" : ""}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-gray-900">
                        {giftOfferActive
                          ? "Special Gift with Your Order!"
                          : "Limited-time gift offer ended"}
                      </h3>

                      {giftOfferActive && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-red-600">
                          Limited offer
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {giftOfferActive
                        ? "Order within the countdown to qualify for a special gift with your product."
                        : "The five-minute offer for this visit has expired."}
                    </p>
                  </div>
                </div>

                {giftOfferActive ? (
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-white/80 px-4 py-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <Clock3 size={16} className="text-red-500" />
                      Offer ends in
                    </div>

                    <div className="rounded-lg bg-gray-900 px-4 py-2 font-mono text-xl font-black tracking-widest text-white">
                      {formatCountdown(giftSeconds)}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl bg-white/70 px-4 py-3 text-xs font-semibold text-gray-500">
                    No active gift offer on this visit.
                  </div>
                )}

                <p className="mt-2 text-[10px] leading-4 text-gray-500">
                  Gift eligibility is subject to order verification and offer
                  availability.
                </p>
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

              {/* COLOUR */}

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

              {/* STOCK */}

              <div className="mt-2">
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

              <div className="mt-2">
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

              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-5 w-5 text-gray-800" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Check delivery
                  </h3>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Enter your PIN code to check the estimated delivery date.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCheckDelivery();
                  }}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                      value={deliveryPincode}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                        setDeliveryPincode(value);
                        setDeliveryEstimate(null);
                        setDeliveryChecked(false);
                        setDeliveryError("");
                      }}
                      placeholder="Enter 6-digit PIN code"
                      aria-label="Delivery PIN code"
                      className="w-full h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={deliveryPincode.length !== 6}
                    className="h-12 rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Check
                  </button>
                </form>

                {deliveryError && (
                  <p className="mt-2 text-sm text-red-600">{deliveryError}</p>
                )}

                {deliveryChecked && deliveryEstimate && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Truck className="h-5 w-5 text-green-700" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-green-800">
                        Estimated delivery by
                      </p>
                      <p className="mt-0.5 text-base font-bold text-gray-900">
                        {deliveryEstimate}
                      </p>
                      <p className="mt-1 text-xs text-gray-600">
                        Delivery estimate for PIN code {deliveryPincode}
                      </p>
                    </div>
                  </div>
                )}

                {!deliveryChecked && !deliveryError && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Truck className="h-4 w-4 shrink-0" />
                    <span>
                      Check your estimated delivery date before ordering.
                    </span>
                  </div>
                )}
              </div>

              {/* CART + BUY */}

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={isOutOfStock || cannotAddMore}
                  onClick={handleAddToCart}
                  className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl border text-sm font-black transition ${
                    isOutOfStock || cannotAddMore
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : currentVariantInCart
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-black bg-white text-black hover:border-black hover:bg-gray-100"
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
                      {currentVariantInCart
                        ? "Add more to cart"
                        : "Add To Cart"}
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
                      : "bg-black shadow-indigo-600/20 hover:-translate-y-0.5 hover:bg-black"
                  }`}
                >
                  Buy Now
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

              <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs font-semibold text-gray-500">
                <ShieldCheck size={15} className="shrink-0 text-green-600" />
                Secure payment • Warranty backed • Quality checked
              </div>
            </div>
          </div>

          {/* ===================================================
              COLLAPSIBLE PRODUCT DETAILS
          =================================================== */}

          <section className="mt-5 overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setDetailsOpen((current) => !current)}
              aria-expanded={detailsOpen}
              className="flex w-full items-center justify-between gap-4 p-2 text-left sm:p-4"
            >
              <div>
                <h2 className="text-xl font-black sm:text-2xl">
                  Product Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Specifications, features and device information
                </p>
              </div>

              <div
                className={`flex h-8 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 ${
                  detailsOpen
                    ? "rotate-180 bg-indigo-50 text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                <ChevronDown size={21} />
              </div>
            </button>

            <div
              className={`grid transition-all duration-500 ease-in-out ${
                detailsOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-gray-100 p-6 sm:p-8">
                  {product.highlights.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {product.highlights.map((highlight) => (
                        <div
                          key={highlight.id}
                          className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4"
                        >
                          <Check
                            size={18}
                            className="mt-0.5 shrink-0 text-green-600"
                          />

                          <p className="text-sm font-semibold text-gray-700">
                            {highlight.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className=" grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                    <Detail
                      title="Rating"
                      value={`${productRating.toFixed(1)}/5`}
                    />

                    <Detail title="Category" value={product.category || "—"} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================
              SAME BRAND PRODUCTS CAROUSEL
          =================================================== */}

          {(similarLoading || similarProducts.length > 0) && (
            <section className="mt-10">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/70">
                    Explore More
                  </p>

                  <h2 className="mt-1 text-xl font-black sm:text-2xl">
                    More from {product.brand}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Discover other devices from this brand.
                  </p>
                </div>

                <Link
                  href={`/buy?search=${encodeURIComponent(product.brand)}`}
                  className="shrink-0 text-xs font-bold text-black/250 transition hover:text-black sm:text-sm"
                >
                  View all
                  <ArrowRight size={14} className="ml-1 inline" />
                </Link>
              </div>

              {similarLoading ? (
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="h-64 min-w-[180px] flex-1 animate-pulse rounded-2xl bg-gray-200"
                    />
                  ))}
                </div>
              ) : (
                <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
                  {similarProducts.map((item) => {
                    const itemImage =
                      item.images?.find((image) => image.type === "IMAGE")
                        ?.url ||
                      item.variants?.[0]?.images?.find(
                        (image) => image.type === "IMAGE",
                      )?.url;

                    const itemPrice = toNumber(item.price);
                    const itemOriginalPrice = toNumber(item.originalPrice);

                    const itemDiscount =
                      itemOriginalPrice > itemPrice && itemOriginalPrice > 0
                        ? Math.round(
                            ((itemOriginalPrice - itemPrice) /
                              itemOriginalPrice) *
                              100,
                          )
                        : 0;

                    return (
                      <Link
                        key={item.id}
                        href={`/buy/${item.id}`}
                        className="group w-[175px] min-w-[175px] snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg sm:w-[220px] sm:min-w-[220px]"
                      >
                        <div className="relative flex h-40 items-center justify-center bg-gray-50 p-4 sm:h-48">
                          {itemDiscount > 0 && (
                            <span className="absolute left-3 top-3 z-10 rounded-full bg-green-600 px-2 py-1 text-[10px] font-bold text-white">
                              {itemDiscount}% OFF
                            </span>
                          )}

                          {itemImage ? (
                            <Image
                              src={getOptimizedImageUrl(itemImage, 400, 75)}
                              alt={`${item.brand} ${item.name}`}
                              fill
                              sizes="220px"
                              className="object-contain p-3 transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <Smartphone size={45} className="text-gray-300" />
                          )}
                        </div>

                        <div className="p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            {item.brand}
                          </p>

                          <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-gray-900">
                            {item.name}
                          </h3>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-base font-black text-gray-900">
                              ₹{formatPrice(itemPrice)}
                            </span>

                            {itemOriginalPrice > itemPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{formatPrice(itemOriginalPrice)}
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-gray-500">
                              {formatCondition(item.condition)}
                            </span>

                            <span className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                              View
                              <ArrowRight size={13} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}

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

              const getBarWidth = (count: number) =>
                totalRatings === 0
                  ? 0
                  : Math.round((count / totalRatings) * 100);

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

                          <p className="mt-0 text-xs font-semibold text-gray-400">
                            {product.reviewCount}{" "}
                            {product.reviewCount === 1 ? "rating" : "ratings"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full max-w-xl flex-1 rounded-2xl bg-gray-50 p-5">
                      <div className="space-y-3">
                        {ratingRows.map((row) => (
                          <div
                            key={row.rating}
                            className="flex items-center gap-3"
                          >
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

                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                                style={{
                                  width: `${getBarWidth(row.count)}%`,
                                }}
                              />
                            </div>

                            <span className="w-8 text-right text-xs font-bold text-gray-500">
                              {row.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

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

                              <p className="mt-4 text-sm leading-6 text-gray-600">
                                {review.comment}
                              </p>

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
                                          loading="lazy"
                                          className="h-32 w-32 object-cover transition duration-300 group-hover:scale-105 sm:h-36 sm:w-36"
                                        />
                                      </a>
                                    ),
                                  )}
                                </div>
                              )}

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
                text="Select your preferred storage and colour."
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

      {/* GIFT VIBRATION ANIMATION */}

      <style jsx global>{`
        @keyframes giftVibration {
          0% {
            transform: rotate(0deg) scale(1);
          }
          15% {
            transform: rotate(-13deg) scale(1.08);
          }
          30% {
            transform: rotate(13deg) scale(1.08);
          }
          45% {
            transform: rotate(-10deg) scale(1.05);
          }
          60% {
            transform: rotate(10deg) scale(1.05);
          }
          75% {
            transform: rotate(-5deg) scale(1.02);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }

        .gift-vibrate {
          animation: giftVibration 0.85s ease-in-out infinite;
          transform-origin: center;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .gift-vibrate {
            animation: none;
          }
        }
      `}</style>
    </>
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
