"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  CreditCard,
  Home,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { ApiError, getOrder, Order } from "../lib/api";

function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getOrder(orderId);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Unable to load your order.");
        }

        if (!cancelled) {
          setOrder(response.data);
        }
      } catch (requestError) {
        console.error("Failed to load order:", requestError);

        if (!cancelled) {
          if (requestError instanceof ApiError) {
            if (requestError.status === 404) {
              setError("This order could not be found.");
            } else if (requestError.status === 401) {
              setError(
                "Your session has expired. Please log in again to view this order.",
              );
            } else {
              setError(requestError.message || "Unable to load your order.");
            }
          } else {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "Unable to load your order.",
            );
          }
        }
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

  const copyOrderNumber = async () => {
    if (!order?.orderNumber) {
      return;
    }

    try {
      await navigator.clipboard.writeText(order.orderNumber);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (copyError) {
      console.error("Unable to copy order number:", copyError);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !order) {
    return <ErrorState message={error} />;
  }

  const firstItem = order.items?.[0];

  const totalItems = order.items.reduce(
    (sum, item) => sum + Math.max(1, item.quantity || 1),
    0,
  );

  const paymentMethodLabel =
    order.paymentMethod === "COD"
      ? "Cash on Delivery"
      : order.paymentMethod === "UPI"
        ? "UPI"
        : order.paymentMethod === "CARD"
          ? "Credit / Debit Card"
          : "EMI";

  const paymentStatusLabel =
    order.paymentStatus?.toUpperCase() === "PAID"
      ? "Paid"
      : order.paymentStatus?.toUpperCase() === "PENDING"
        ? "Payment pending"
        : formatStatus(order.paymentStatus);

  const orderStatus = formatStatus(order.status);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        {/* SUCCESS */}

        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={42} className="text-green-600" />
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Order placed successfully!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Thank you for shopping with SureBuy. Your order has been
            successfully placed and we&apos;ll keep you updated about its
            delivery.
          </p>

          {/* ORDER NUMBER */}

          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Order number
              </p>

              <p className="mt-1 text-sm font-black text-gray-900">
                {order.orderNumber}
              </p>
            </div>

            <button
              type="button"
              onClick={copyOrderNumber}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
              aria-label="Copy order number"
            >
              {copied ? <Check size={16} /> : <Clipboard size={16} />}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}

        <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_340px]">
          {/* LEFT */}

          <div className="space-y-7">
            {/* ORDER SUMMARY */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Package size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-black">Order summary</h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                  {orderStatus}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {order.items.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>
            </section>

            {/* DELIVERY */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Truck size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Delivery information</h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Your order will be delivered to this address.
                  </p>
                </div>
              </div>

              {order.shippingAddress ? (
                <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm font-black">
                    {order.shippingAddress.fullName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2
                      ? `, ${order.shippingAddress.addressLine2}`
                      : ""}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-gray-500">
                    Mobile: {order.shippingAddress.phone}
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Delivery address information is unavailable.
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <OrderStep
                  active
                  icon={<Check size={18} />}
                  title="Order placed"
                  text="Your order has been confirmed."
                />

                <OrderStep
                  active={isProcessingStatus(order.status)}
                  icon={<Package size={18} />}
                  title="Processing"
                  text="We are preparing your device."
                />

                <OrderStep
                  icon={<Truck size={18} />}
                  title="Delivery"
                  text="Estimated delivery in 3–5 business days."
                />
              </div>
            </section>

            {/* TRUST */}

            <div className="grid gap-4 sm:grid-cols-3">
              <TrustItem
                icon={<ShieldCheck size={18} />}
                title="Quality checked"
                text="Every device is inspected before delivery."
              />

              <TrustItem
                icon={<Truck size={18} />}
                title="Fast delivery"
                text="Your order will be shipped securely."
              />

              <TrustItem
                icon={<CheckCircle2 size={18} />}
                title="Order protected"
                text="Track your order from your account."
              />
            </div>
          </div>

          {/* RIGHT */}

          <aside>
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">Payment details</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-semibold">
                    {formatCurrency(order.subtotal, order.currency)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Discount</span>

                  <span className="font-semibold text-green-600">
                    - {formatCurrency(order.discountAmount, order.currency)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Delivery</span>

                  <span className="font-bold text-green-600">
                    {Number(order.deliveryAmount) === 0
                      ? "FREE"
                      : formatCurrency(order.deliveryAmount, order.currency)}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-gray-100" />

              <div className="flex items-center justify-between gap-4">
                <span className="font-black">Total amount</span>

                <span className="text-xl font-black">
                  {formatCurrency(order.totalAmount, order.currency)}
                </span>
              </div>

              {/* PAYMENT */}

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <CreditCard size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-500">
                      Payment method
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {paymentMethodLabel}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">
                    Payment status
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      order.paymentStatus?.toUpperCase() === "PAID"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {paymentStatusLabel}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}

              <Link
                href={`/track-order/${encodeURIComponent(order.id)}`}
                className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                View order
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/buy"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-indigo-600 hover:text-indigo-600"
              >
                <ShoppingBag size={17} />
                Continue shopping
              </Link>

              <div className="mt-5 flex items-center justify-center gap-2 border-t border-gray-100 pt-5 text-[11px] font-semibold text-gray-500">
                <ShieldCheck size={14} />
                Secure order processing
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
/* =========================================================
   ORDER ITEM
========================================================= */

function OrderItem({ item }: { item: Order["items"][number] }) {
  const quantity = Math.max(1, item.quantity || 1);

  return (
    <div className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
      <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-3">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="h-full w-full object-contain"
          />
        ) : (
          <Package size={30} className="text-gray-300" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {item.brand && (
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {item.brand}
          </p>
        )}

        <h3 className="mt-1 text-base font-black">{item.productName}</h3>

        <div className="mt-2 flex flex-wrap gap-2">
          {item.storage && (
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold">
              {item.storage}
            </span>
          )}

          {item.color && (
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold">
              {item.color}
            </span>
          )}

          {item.condition && (
            <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
              {item.condition}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-lg font-black">{formatCurrency(item.unitPrice)}</p>

          <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
            Qty: {quantity}
          </span>

          <span className="text-xs font-semibold text-gray-400">
            Total: {formatCurrency(item.subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ORDER STEP
========================================================= */

function OrderStep({
  active = false,
  icon,
  title,
  text,
}: {
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-xs font-black">{title}</h3>

        <p className="mt-1 text-[11px] leading-5 text-gray-500">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-gray-950"
          >
            Sure<span className="text-indigo-600">Buy</span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
        <div className="animate-pulse">
          <div className="mx-auto h-20 w-20 rounded-full bg-gray-200" />

          <div className="mx-auto mt-6 h-9 max-w-sm rounded bg-gray-200" />

          <div className="mx-auto mt-3 h-4 max-w-xl rounded bg-gray-200" />

          <div className="mx-auto mt-6 h-12 max-w-xs rounded-2xl bg-gray-200" />

          <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_340px]">
            <div className="space-y-7">
              <div className="h-72 rounded-3xl bg-gray-200" />
              <div className="h-64 rounded-3xl bg-gray-200" />
            </div>

            <div className="h-96 rounded-3xl bg-gray-200" />
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   ERROR
========================================================= */

function ErrorState({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight text-gray-950"
          >
            Sure<span className="text-indigo-600">Buy</span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-xl px-5 py-20">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Package size={28} className="text-gray-500" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-gray-950">
            Order details unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {message ||
              "We couldn't load this order. Please check your orders and try again."}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              View my orders
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:border-indigo-600 hover:text-indigo-600"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(
  value: number | string | null | undefined,
  currency = "INR",
) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatStatus(status: string | null | undefined) {
  if (!status) {
    return "Processing";
  }

  return status
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isProcessingStatus(status: string | null | undefined) {
  if (!status) {
    return false;
  }

  const normalized = status.toUpperCase();

  return [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "PAID",
    "PACKED",
    "SHIPPED",
  ].includes(normalized);
}
