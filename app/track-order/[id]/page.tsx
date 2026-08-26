"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { getOrder } from "@/app/lib/api";

type TrackOrderItem = {
  id: string;
  productId: number;
  variantId?: number | null;

  productName?: string | null;
  brand?: string | null;
  category?: string | null;
  condition?: string | null;

  storage?: string | null;
  color?: string | null;
  imageUrl?: string | null;

  unitPrice?: number | string | null;
  quantity?: number | null;
  subtotal?: number | string | null;
};

type TrackOrder = {
  id: string;
  orderNumber?: string | null;

  status: string;
  paymentStatus: string;
  paymentMethod: string;

  totalAmount: number | string;

  createdAt: string;
  updatedAt: string;

  shippingAddress?: {
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
  } | null;

  items: TrackOrderItem[];
};

type ApiErrorLike = {
  status?: number;
  message?: string;
};

const trackingSteps = [
  {
    key: "confirmed",
    title: "Order confirmed",
    description: "Your order has been successfully placed.",
    icon: CheckCircle2,
  },
  {
    key: "payment",
    title: "Payment confirmed",
    description: "Your payment has been verified.",
    icon: ShieldCheck,
  },
  {
    key: "packed",
    title: "Order packed",
    description: "Your device has been quality checked and packed.",
    icon: Package,
  },
  {
    key: "shipped",
    title: "Shipped",
    description: "Your order has left our fulfilment centre.",
    icon: Truck,
  },
  {
    key: "out",
    title: "Out for delivery",
    description: "Your order is on the way to your address.",
    icon: MapPin,
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Your order has been delivered successfully.",
    icon: CheckCircle2,
  },
];

function isApiError(error: unknown): error is ApiErrorLike {
  return typeof error === "object" && error !== null;
}

function formatCurrency(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TrackOrderPage() {
  const params = useParams<{ id: string }>();

  const orderId = params?.id;

  const [order, setOrder] = useState<TrackOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError("Invalid order ID.");
      return;
    }

    let cancelled = false;

    const loadOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getOrder(String(orderId));

        if (cancelled) {
          return;
        }

        if (!response.success || !response.data) {
          throw new Error(response.message || "Unable to load order details.");
        }

        setOrder(response.data as TrackOrder);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error("TRACK ORDER LOAD ERROR:", error);

        if (isApiError(error)) {
          if (error.status === 401) {
            setError("Please sign in to view this order.");
          } else if (error.status === 404) {
            setError("This order could not be found.");
          } else {
            setError(error.message || "Unable to load tracking details.");
          }
        } else if (error instanceof Error) {
          setError(error.message || "Unable to load tracking details.");
        } else {
          setError("Unable to load tracking details.");
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

  const currentStep = useMemo(() => {
    if (!order) {
      return 0;
    }

    const status = order.status.toUpperCase();
    const paymentStatus = order.paymentStatus.toUpperCase();

    if (status === "CANCELLED" || status === "REFUNDED") {
      return -1;
    }

    if (status === "DELIVERED") {
      return 5;
    }

    if (status === "OUT_FOR_DELIVERY" || status === "OUT FOR DELIVERY") {
      return 4;
    }

    if (status === "SHIPPED") {
      return 3;
    }

    if (status === "PROCESSING" || status === "PACKED") {
      return 2;
    }

    if (status === "CONFIRMED" && paymentStatus === "PAID") {
      return 1;
    }

    if (status === "CONFIRMED") {
      return 0;
    }

    return 0;
  }, [order]);

  const primaryItem = order?.items?.[0] ?? null;

  const displayOrderId = order?.orderNumber || order?.id || String(orderId);

  const expectedDelivery = undefined;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading tracking details...
          </p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-5 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Package size={28} className="text-red-500" />
          </div>

          <h1 className="mt-6 text-2xl font-black">Order not found</h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error || "We couldn't find tracking information for this order."}
          </p>

          <Link
            href="/buy"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const address = order.shippingAddress;

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <section className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        {/* TITLE */}

        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Order tracking
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Track your order
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Order ID:{" "}
            <span className="font-bold text-gray-900">{displayOrderId}</span>
          </p>
        </div>

        {/* CURRENT STATUS */}

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Truck size={27} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Current status
                </p>

                <h2 className="mt-1 text-xl font-black">
                  {formatStatus(order.status)}
                </h2>
              </div>
            </div>

            {expectedDelivery && (
              <div className="rounded-2xl bg-green-50 px-5 py-4">
                <p className="text-xs font-bold text-green-700">
                  Expected delivery
                </p>

                <p className="mt-1 text-sm font-black text-green-800">
                  {expectedDelivery}
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
              <span>
                Payment:{" "}
                <strong className="text-gray-800">
                  {formatStatus(order.paymentStatus)}
                </strong>
              </span>

              <span>
                Method:{" "}
                <strong className="text-gray-800">
                  {formatStatus(order.paymentMethod)}
                </strong>
              </span>

              <span>
                Placed:{" "}
                <strong className="text-gray-800">
                  {formatDate(order.createdAt)}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* TIMELINE */}

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black">Delivery progress</h2>

          <p className="mt-2 text-sm text-gray-500">
            Follow your order from confirmation to delivery.
          </p>

          {currentStep === -1 ? (
            <div className="mt-6 rounded-2xl bg-red-50 p-5">
              <p className="text-sm font-black text-red-700">
                {formatStatus(order.status)}
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                This order is no longer progressing through the normal delivery
                timeline.
              </p>
            </div>
          ) : (
            <div className="mt-8">
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;

                const completed = index <= currentStep;
                const active = index === currentStep;

                return (
                  <div
                    key={step.key}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    {/* LINE */}

                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`absolute left-5 top-11 h-[calc(100%-20px)] w-px ${
                          index < currentStep ? "bg-indigo-600" : "bg-gray-200"
                        }`}
                      />
                    )}

                    {/* ICON */}

                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        completed
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      {completed && !active ? (
                        <Check size={17} />
                      ) : (
                        <Icon size={18} />
                      )}
                    </div>

                    {/* CONTENT */}

                    <div className="flex-1 pt-0.5">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row">
                        <h3
                          className={`text-sm font-black ${
                            completed ? "text-gray-950" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </h3>

                        {active && (
                          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                            <Clock3 size={11} />
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PRODUCT + ADDRESS */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* PRODUCT */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">Your item</h2>

            {!primaryItem ? (
              <p className="mt-5 text-sm text-gray-500">
                No product information is available.
              </p>
            ) : (
              <div className="mt-5 flex gap-4">
                <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 p-3">
                  {primaryItem.imageUrl ? (
                    <img
                      src={primaryItem.imageUrl}
                      alt={primaryItem.productName || "Ordered product"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Package size={28} className="text-gray-300" />
                  )}
                </div>

                <div className="min-w-0">
                  {primaryItem.brand && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {primaryItem.brand}
                    </p>
                  )}

                  <h3 className="mt-1 font-black">
                    {primaryItem.productName || "Product"}
                  </h3>

                  {primaryItem.storage && (
                    <p className="mt-1 text-xs text-gray-500">
                      Storage: {primaryItem.storage}
                    </p>
                  )}

                  {primaryItem.color && (
                    <p className="mt-1 text-xs text-gray-500">
                      Color: {primaryItem.color}
                    </p>
                  )}

                  {primaryItem.condition && (
                    <p className="mt-1 text-xs text-gray-500">
                      Condition: {formatStatus(primaryItem.condition)}
                    </p>
                  )}

                  <p className="mt-3 text-sm font-black">
                    {formatCurrency(
                      primaryItem.subtotal ?? primaryItem.unitPrice,
                    )}
                  </p>

                  {(primaryItem.quantity ?? 1) > 1 && (
                    <p className="mt-1 text-xs text-gray-500">
                      Quantity: {primaryItem.quantity}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ORDER TOTAL */}

            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">
                  Order total
                </span>

                <span className="text-lg font-black">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* ADDRESS */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">Delivery address</h2>

            {!address ? (
              <p className="mt-5 text-sm text-gray-500">
                Delivery address is unavailable.
              </p>
            ) : (
              <div className="mt-5 flex gap-3">
                <MapPin size={19} className="mt-0.5 shrink-0 text-indigo-600" />

                <div>
                  {address.fullName && (
                    <p className="text-sm font-black">{address.fullName}</p>
                  )}

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {address.addressLine1}

                    {address.addressLine2 && (
                      <>
                        <br />
                        {address.addressLine2}
                      </>
                    )}

                    {address.area && (
                      <>
                        <br />
                        {address.area}
                      </>
                    )}

                    {(address.city || address.state || address.postalCode) && (
                      <>
                        <br />
                        {address.city}
                        {address.city && address.state ? ", " : ""}
                        {address.state}

                        {address.postalCode ? ` - ${address.postalCode}` : ""}
                      </>
                    )}

                    {address.country && (
                      <>
                        <br />
                        {address.country}
                      </>
                    )}

                    {address.landmark && (
                      <>
                        <br />
                        Landmark: {address.landmark}
                      </>
                    )}
                  </p>

                  {address.phone && (
                    <p className="mt-2 text-xs font-semibold text-gray-500">
                      {address.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/orders/${encodeURIComponent(order.id)}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            <Package size={17} />
            View order details
          </Link>

          <Link
            href="/buy"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
