"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  ImagePlus,
  MapPin,
  Package,
  Send,
  ShieldCheck,
  Star,
  Truck,
  Video,
} from "lucide-react";

import {
  ApiError,
  getOrder,
} from "@/app/lib/api";

/* =========================================================
   BACKEND TYPES
========================================================= */

type BackendOrderItem = {
  id: string;
  productId: string;
  variantId?: string | null;

  productName?: string | null;
  brand?: string | null;
  category?: string | null;
  condition?: string | null;

  storage?: string | null;
  color?: string | null;

  imageUrl?: string | null;

  unitPrice?: number | string | null;
  originalPrice?: number | string | null;

  quantity?: number | null;
  subtotal?: number | string | null;

  createdAt?: string | null;
};

type BackendShippingAddress = {
  fullName?: string | null;
  phone?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;

  area?: string | null;

  city?: string | null;
  state?: string | null;
  postalCode?: string | null;

  country?: string | null;
  landmark?: string | null;
};

type BackendOrder = {
  id: string;
  orderNumber?: string | null;
  userId?: string;

  status?: string | null;
  paymentStatus?: string | null;
  paymentMethod?: string | null;

  subtotal?: number | string | null;
  deliveryAmount?: number | string | null;
  discountAmount?: number | string | null;
  totalAmount?: number | string | null;

  currency?: string | null;

  shippingAddress?: BackendShippingAddress | null;

  items?: BackendOrderItem[];

  createdAt?: string | null;
  updatedAt?: string | null;
};

/* =========================================================
   FRONTEND TYPES
========================================================= */

type OrderProduct = {
  id: string;
  name: string;
  brand: string;
  image: string;
  storage?: string;
  color?: string;
  condition?: string;
  price: number;
  quantity?: number;
};

type Order = {
  orderId: string;
  orderNumber?: string;
  createdAt: string;

  status: string;

  paymentMethod: string;
  paymentStatus: string;

  product: OrderProduct;

  quantity: number;

  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;

  address: {
    name: string;
    phone: string;
    address: string;
    addressLine2?: string;
    area?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    landmark?: string;
  };

  expectedDelivery?: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const FALLBACK_IMAGE = "/images/iphone-15.png";

/* =========================================================
   HELPERS
========================================================= */

const toNumber = (
  value: number | string | null | undefined,
): number => {
  const number = Number(value ?? 0);

  return Number.isFinite(number) ? number : 0;
};

const formatDate = (
  value?: string | null,
) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const normalizeStatus = (
  status?: string | null,
) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "Processing";

    case "PROCESSING":
      return "Processing";

    case "CONFIRMED":
      return "Confirmed";

    case "SHIPPED":
      return "Shipped";

    case "OUT_FOR_DELIVERY":
    case "OUT FOR DELIVERY":
      return "Out for Delivery";

    case "DELIVERED":
      return "Delivered";

    case "CANCELLED":
    case "CANCELED":
      return "Cancelled";

    default:
      return status || "Processing";
  }
};

const normalizePaymentMethod = (
  value?: string | null,
) => {
  if (!value) return "Pending";

  switch (value.toUpperCase()) {
    case "COD":
      return "Cash on Delivery";

    case "UPI":
      return "UPI";

    case "CARD":
      return "Card";

    default:
      return value;
  }
};

const normalizePaymentStatus = (
  value?: string | null,
) => {
  if (!value) return "Pending";

  switch (value.toUpperCase()) {
    case "PAID":
      return "Paid";

    case "PENDING":
      return "Pending";

    case "FAILED":
      return "Failed";

    case "REFUNDED":
      return "Refunded";

    default:
      return value;
  }
};

/* =========================================================
   BACKEND -> FRONTEND MAPPER
========================================================= */

const normalizeOrder = (
  backendOrder: BackendOrder,
): Order => {
  const item =
    backendOrder.items?.[0];

  const shipping =
    backendOrder.shippingAddress;

  const productId =
    String(item?.productId ?? "");

  const productName =
    item?.productName ||
    "Product";

  const brand =
    item?.brand || "";

  const image =
    item?.imageUrl ||
    FALLBACK_IMAGE;

  const quantity =
    Math.max(
      1,
      Number(item?.quantity ?? 1),
    );

  const unitPrice =
    toNumber(item?.unitPrice);

  const subtotal =
    toNumber(
      backendOrder.subtotal,
    );

  const total =
    toNumber(
      backendOrder.totalAmount,
    );

  const deliveryFee =
    toNumber(
      backendOrder.deliveryAmount,
    );

  const discount =
    toNumber(
      backendOrder.discountAmount,
    );

  return {
    orderId: backendOrder.id,

    orderNumber:
      backendOrder.orderNumber ||
      undefined,

    createdAt:
      backendOrder.createdAt ||
      "",

    status:
      normalizeStatus(
        backendOrder.status,
      ),

    paymentMethod:
      normalizePaymentMethod(
        backendOrder.paymentMethod,
      ),

    paymentStatus:
      normalizePaymentStatus(
        backendOrder.paymentStatus,
      ),

    product: {
      id: productId,

      name: productName,

      brand,

      image,

      storage:
        item?.storage ||
        undefined,

      color:
        item?.color ||
        undefined,

      condition:
        item?.condition ||
        undefined,

      price:
        unitPrice,

      quantity,
    },

    quantity,

    subtotal,

    deliveryFee,

    discount,

    total,

    address: {
      name:
        shipping?.fullName ||
        "—",

      phone:
        shipping?.phone ||
        "—",

      address:
        shipping?.addressLine1 ||
        "—",

      addressLine2:
        shipping?.addressLine2 ||
        undefined,

      area:
        shipping?.area ||
        undefined,

      city:
        shipping?.city ||
        "—",

      state:
        shipping?.state ||
        "—",

      pincode:
        shipping?.postalCode ||
        "—",

      country:
        shipping?.country ||
        undefined,

      landmark:
        shipping?.landmark ||
        undefined,
    },
  };
};

/* =========================================================
   PAGE
========================================================= */

export default function OrderDetailsPage() {
const params = useParams<{ id: string }>();

const orderId = params?.id;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     REVIEW STATE
  ======================================================= */

  const [rating, setRating] =
    useState(0);

  const [hoverRating, setHoverRating] =
    useState(0);

  const [reviewText, setReviewText] =
    useState("");

  const [reviewSubmitted, setReviewSubmitted] =
    useState(false);

  const [selectedPhotos, setSelectedPhotos] =
    useState<File[]>([]);

  const [selectedVideo, setSelectedVideo] =
    useState<File | null>(null);

  const [photoPreviews, setPhotoPreviews] =
    useState<string[]>([]);

  const [videoPreview, setVideoPreview] =
    useState<string | null>(null);

  /* =======================================================
     LOAD ORDER FROM BACKEND
  ======================================================= */

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Order ID is missing.");
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching order:",
          orderId,
        );

        const response =
          await getOrder(
            String(orderId),
          );

        if (cancelled) {
          return;
        }

        /*
         * apiRequest returns:
         *
         * {
         *   success: true,
         *   data: {...}
         * }
         */

        const payload =
          response as {
            success?: boolean;
            data?: BackendOrder;
          };

        if (
          !payload?.success ||
          !payload?.data
        ) {
          throw new Error(
            "Invalid order response from server.",
          );
        }

        const normalized =
          normalizeOrder(
            payload.data,
          );

        setOrder(normalized);

        /*
         * Load locally saved review for now.
         *
         * This will later be replaced by
         * the real review API.
         */

        try {
          const savedReview =
            localStorage.getItem(
              `PhoneBhai-review-${normalized.orderId}`,
            );

          if (savedReview) {
            const parsedReview =
              JSON.parse(
                savedReview,
              ) as {
                rating?: number;
                review?: string;
              };

            setRating(
              Number(
                parsedReview.rating ?? 0,
              ),
            );

            setReviewText(
              parsedReview.review || "",
            );

            setReviewSubmitted(true);
          }
        } catch {
          /*
           * Local review data should never
           * break the order page.
           */
        }
      } catch (err) {
        console.error(
          "ORDER DETAILS LOAD ERROR:",
          err,
        );

        if (cancelled) {
          return;
        }

        if (err instanceof ApiError) {
          if (err.status === 401) {
            setError(
              "Please sign in to view this order.",
            );
          } else if (
            err.status === 404
          ) {
            setError(
              "This order could not be found.",
            );
          } else {
            setError(
              err.message ||
                "Unable to load this order.",
            );
          }
        } else if (
          err instanceof Error
        ) {
          setError(
            err.message ||
              "Unable to load this order.",
          );
        } else {
          setError(
            "Unable to load this order.",
          );
        }

        setOrder(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  /* =======================================================
     REVIEW
  ======================================================= */

  const handleRating = (
    value: number,
  ) => {
    setRating(value);
  };

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files || [],
    );

    const validFiles =
      files.filter((file) =>
        file.type.startsWith(
          "image/",
        ),
      );

    if (
      validFiles.length === 0
    ) {
      event.target.value = "";
      return;
    }

    const combinedFiles = [
      ...selectedPhotos,
      ...validFiles,
    ].slice(0, 5);

    setSelectedPhotos(
      combinedFiles,
    );

    const previews =
      combinedFiles.map(
        (file) =>
          URL.createObjectURL(
            file,
          ),
      );

    setPhotoPreviews(
      previews,
    );

    event.target.value = "";
  };

  const handleVideoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "video/",
      )
    ) {
      event.target.value = "";
      return;
    }

    if (videoPreview) {
      URL.revokeObjectURL(
        videoPreview,
      );
    }

    setSelectedVideo(file);

    const preview =
      URL.createObjectURL(file);

    setVideoPreview(preview);

    event.target.value = "";
  };

  const removePhoto = (
    index: number,
  ) => {
    const preview =
      photoPreviews[index];

    if (preview) {
      URL.revokeObjectURL(
        preview,
      );
    }

    const updatedFiles =
      selectedPhotos.filter(
        (_, fileIndex) =>
          fileIndex !== index,
      );

    const updatedPreviews =
      photoPreviews.filter(
        (_, previewIndex) =>
          previewIndex !== index,
      );

    setSelectedPhotos(
      updatedFiles,
    );

    setPhotoPreviews(
      updatedPreviews,
    );
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(
        videoPreview,
      );
    }

    setSelectedVideo(null);
    setVideoPreview(null);
  };

  const handleSubmitReview = () => {
    if (!order) return;

    if (rating === 0) {
      alert(
        "Please select a rating first.",
      );
      return;
    }

    if (!reviewText.trim()) {
      alert(
        "Please write a review.",
      );
      return;
    }

    const reviewData = {
      orderId:
        order.orderId,

      productId:
        order.product.id,

      rating,

      review:
        reviewText.trim(),

      createdAt:
        new Date().toISOString(),
    };

    /*
     * Temporary local persistence.
     *
     * We will replace this with
     * POST /reviews once the review
     * backend is implemented.
     */

    localStorage.setItem(
      `PhoneBhai-review-${order.orderId}`,
      JSON.stringify(
        reviewData,
      ),
    );

    localStorage.setItem(
      `PhoneBhai-rating-${order.orderId}`,
      String(rating),
    );

    setReviewSubmitted(true);
  };

  /* =======================================================
     FORMATTED DATE
  ======================================================= */

  const formattedDate =
    useMemo(() => {
      return formatDate(
        order?.createdAt,
      );
    }, [order]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-gray-200" />
            <div className="h-4 w-72 rounded bg-gray-200" />

            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="h-28 rounded-3xl bg-white" />
                <div className="h-56 rounded-3xl bg-white" />
                <div className="h-96 rounded-3xl bg-white" />
              </div>

              <div className="h-96 rounded-3xl bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR / NOT FOUND
  ======================================================= */

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-5 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Package
              className="text-red-500"
              size={28}
            />
          </div>

          <h1 className="mt-6 text-2xl font-black text-gray-950">
            {error ||
              "Order not found"}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            {error
              ? "We couldn't load the requested order. Please try again or return to your orders."
              : "We couldn't find this order."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              My orders
            </Link>

            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const product =
    order.product;

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* TITLE */}

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Order details
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Your order
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span>
              Order ID:{" "}
              <strong className="text-gray-900">
                {order.orderNumber ||
                  order.orderId}
              </strong>
            </span>

            <span className="text-gray-300">
              •
            </span>

            <span>
              Placed on{" "}
              {formattedDate ||
                "—"}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">
            {/* STATUS */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
                    <CheckCircle2
                      size={25}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-black text-gray-950">
                      {order.status}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {order.status ===
                      "Delivered"
                        ? "Your order has been delivered successfully."
                        : order.status ===
                            "Cancelled"
                          ? "This order has been cancelled."
                          : "Your order is being processed."}
                    </p>
                  </div>
                </div>

                {order.status !==
                  "Cancelled" && (
                  <Link
                    href={`/track-order/${order.orderId}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    <Truck size={16} />
                    Track order
                  </Link>
                )}
              </div>
            </div>

            {/* PRODUCT */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">
                  Items in this order
                </h2>

                <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700">
                  Quality checked
                </span>
              </div>

              <div className="mt-6 flex gap-5">
                <div className="flex h-32 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-4">
                  <img
                    src={
                      product.image ||
                      FALLBACK_IMAGE
                    }
                    alt={
                      product.name
                    }
                    className="h-full w-full object-contain"
                    onError={(
                      event,
                    ) => {
                      event.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {product.brand}
                  </p>

                  <h3 className="mt-1 text-lg font-black text-gray-950">
                    {product.name}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-gray-500">
                    {product.storage && (
                      <p>
                        Storage:{" "}
                        {
                          product.storage
                        }
                      </p>
                    )}

                    {product.color && (
                      <p>
                        Colour:{" "}
                        {
                          product.color
                        }
                      </p>
                    )}

                    {product.condition && (
                      <p>
                        Condition:{" "}
                        {
                          product.condition
                        }
                      </p>
                    )}

                    <p>
                      Quantity:{" "}
                      {order.quantity}
                    </p>
                  </div>

                  <p className="mt-4 text-lg font-black text-gray-950">
                    ₹
                    {product.price.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                RATE & REVIEW
            ================================================= */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
                  <Star
                    size={19}
                    className="text-yellow-500"
                    fill="currentColor"
                  />
                </div>

                <div>
                  <h2 className="font-black">
                    Rate your purchase
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    How would you rate this product?
                  </p>
                </div>
              </div>

              {/* STARS */}

              <div
                className="mt-6 flex items-center gap-1"
                onMouseLeave={() =>
                  setHoverRating(
                    0,
                  )
                }
              >
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (star) => {
                    const activeRating =
                      hoverRating ||
                      rating;

                    return (
                      <button
                        key={
                          star
                        }
                        type="button"
                        aria-label={`Rate ${star} out of 5`}
                        onMouseEnter={() =>
                          setHoverRating(
                            star,
                          )
                        }
                        onClick={() =>
                          handleRating(
                            star,
                          )
                        }
                        className="rounded-lg p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        <Star
                          size={
                            34
                          }
                          className={
                            star <=
                            activeRating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                          fill={
                            star <=
                            activeRating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    );
                  },
                )}
              </div>

              {rating > 0 && (
                <p className="mt-3 text-sm font-bold text-gray-700">
                  {rating}/5{" "}
                  <span className="font-medium text-gray-400">
                    {rating ===
                    5
                      ? "Excellent!"
                      : rating ===
                          4
                        ? "Very good!"
                        : rating ===
                            3
                          ? "Good"
                          : rating ===
                              2
                            ? "Could be better"
                            : "Poor"}
                  </span>
                </p>
              )}

              {/* REVIEW */}

              <div className="mt-7 border-t border-gray-100 pt-7">
                <h3 className="text-base font-black">
                  Write a review
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Tell us about your experience with this product.
                </p>

                <textarea
                  value={
                    reviewText
                  }
                  onChange={(
                    event,
                  ) =>
                    setReviewText(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Share your experience with the product..."
                  maxLength={
                    1000
                  }
                  rows={5}
                  className="mt-4 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />

                <div className="mt-2 flex justify-end">
                  <span className="text-[11px] text-gray-400">
                    {
                      reviewText.length
                    }
                    /1000
                  </span>
                </div>

                {/* MEDIA */}

                <div className="mt-6">
                  <p className="text-sm font-black">
                    Add photos or video
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    You can add up to 5 photos and 1 video.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {/* PHOTO */}

                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600">
                      <ImagePlus size={22} />

                      <span className="mt-2 text-[11px] font-bold">
                        Add photos
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={
                          handlePhotoChange
                        }
                        disabled={
                          selectedPhotos.length >=
                          5
                        }
                      />
                    </label>

                    {/* VIDEO */}

                    <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600">
                      <Video size={22} />

                      <span className="mt-2 text-[11px] font-bold">
                        Add video
                      </span>

                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={
                          handleVideoChange
                        }
                        disabled={
                          !!selectedVideo
                        }
                      />
                    </label>
                  </div>

                  {/* PHOTO PREVIEWS */}

                  {photoPreviews.length >
                    0 && (
                    <div className="mt-5">
                      <p className="mb-3 text-xs font-bold text-gray-500">
                        Photos
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {photoPreviews.map(
                          (
                            preview,
                            index,
                          ) => (
                            <div
                              key={`${preview}-${index}`}
                              className="relative h-24 w-24 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                            >
                              <img
                                src={
                                  preview
                                }
                                alt={`Review photo ${index + 1}`}
                                className="h-full w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removePhoto(
                                    index,
                                  )
                                }
                                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white"
                                aria-label={`Remove photo ${index + 1}`}
                              >
                                ×
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* VIDEO */}

                  {videoPreview && (
                    <div className="mt-5">
                      <p className="mb-3 text-xs font-bold text-gray-500">
                        Video
                      </p>

                      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-black">
                        <video
                          src={
                            videoPreview
                          }
                          controls
                          className="max-h-72 w-full"
                        />

                        <button
                          type="button"
                          onClick={
                            removeVideo
                          }
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white"
                          aria-label="Remove video"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* SUBMIT */}

                <button
                  type="button"
                  onClick={
                    handleSubmitReview
                  }
                  disabled={
                    rating === 0 ||
                    !reviewText.trim()
                  }
                  className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  <Send size={17} />

                  {reviewSubmitted
                    ? "Update Review"
                    : "Submit Review"}
                </button>

                {reviewSubmitted && (
                  <div className="mt-4 rounded-2xl bg-green-50 p-4">
                    <p className="text-sm font-bold text-green-800">
                      ✓ Your review has been saved.
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                      Thank you for sharing your experience.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* DELIVERY */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="font-black">
                    Delivery address
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Your order will be delivered here.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-5">
                <p className="text-sm font-black text-gray-900">
                  {order.address.name}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {order.address.address}

                  {order.address.addressLine2 && (
                    <>
                      <br />
                      {
                        order
                          .address
                          .addressLine2
                      }
                    </>
                  )}

                  {order.address.area && (
                    <>
                      <br />
                      {
                        order
                          .address
                          .area
                      }
                    </>
                  )}

                  <br />

                  {order.address.city},{" "}
                  {
                    order.address
                      .state
                  }{" "}
                  -{" "}
                  {
                    order.address
                      .pincode
                  }
                </p>

                {order.address
                  .landmark && (
                  <p className="mt-2 text-xs text-gray-500">
                    Landmark:{" "}
                    {
                      order
                        .address
                        .landmark
                    }
                  </p>
                )}

                <p className="mt-2 text-xs font-semibold text-gray-500">
                  Phone:{" "}
                  {
                    order.address
                      .phone
                  }
                </p>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2 className="font-black">
                    Payment information
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Payment details for this order.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Info
                  label="Payment method"
                  value={
                    order.paymentMethod
                  }
                />

                <Info
                  label="Payment status"
                  value={
                    order.paymentStatus
                  }
                />
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT
          ================================================= */}

          <aside>
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">
                Order summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Item price
                  </span>

                  <span className="font-semibold">
                    ₹
                    {order.subtotal.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-semibold">
                    {order.deliveryFee ===
                    0
                      ? "FREE"
                      : `₹${order.deliveryFee.toLocaleString(
                          "en-IN",
                        )}`}
                  </span>
                </div>

                {order.discount >
                  0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">
                      Discount
                    </span>

                    <span className="font-semibold text-green-600">
                      -₹
                      {order.discount.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-black">
                      Total
                    </span>

                    <span className="text-xl font-black">
                      ₹
                      {order.total.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                <div className="flex gap-3">
                  <Package
                    size={19}
                    className="shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="text-xs font-black text-gray-800">
                      Order status
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-700">
                      {order.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {order.status !==
                  "Cancelled" && (
                  <Link
                    href={`/track-order/${order.orderId}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    <Truck size={17} />
                    Track order
                  </Link>
                )}

                <Link
                  href="/orders"
                  className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Back to orders
                </Link>

                <Link
                  href="/buy"
                  className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Continue shopping
                </Link>
              </div>

              <div className="mt-6 flex gap-3 rounded-2xl bg-gray-50 p-4">
                <BadgeCheck
                  size={19}
                  className="shrink-0 text-indigo-600"
                />

                <p className="text-[11px] leading-5 text-gray-500">
                  Your device is quality checked and covered by the warranty mentioned on the product page.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   INFO
========================================================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-semibold text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold capitalize text-gray-900">
        {value}
      </p>
    </div>
  );
}