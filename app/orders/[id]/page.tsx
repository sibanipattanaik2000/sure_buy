"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

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
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  product: OrderProduct;
  quantity: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  expectedDelivery?: string;
};

const STORAGE_KEY = "phonebuy-order";

export default function OrderDetailsPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(STORAGE_KEY);

      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder) as Order;
        setOrder(parsedOrder);
      }
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const formattedDate = useMemo(() => {
    if (!order?.createdAt) return "";

    const date = new Date(order.createdAt);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [order]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
          <p className="mt-4 text-sm font-semibold text-gray-500">
            Loading order...
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
            <Package className="text-red-500" size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-black text-gray-950">
            Order not found
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            We couldn't find this order on this device.
          </p>

          <Link
            href="/buy"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const product = order.product;

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/buy"
            className="flex items-center gap-2 text-sm font-bold text-gray-600 transition hover:text-black"
          >
            <ArrowLeft size={17} />
            Continue shopping
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <ShieldCheck size={16} className="text-green-600" />
            Secure order
          </div>
        </div>
      </header>

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
              <strong className="text-gray-900">{order.orderId}</strong>
            </span>

            <span className="text-gray-300">•</span>

            <span>Placed on {formattedDate}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}

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
                      {order.status || "Order confirmed"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Your order has been successfully placed.
                    </p>
                  </div>
                </div>

                <Link
                  href={`/track-order/${order.orderId}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-700"
                >
                  <Truck size={16} />
                  Track order
                </Link>
              </div>
            </div>

            {/* PRODUCT */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black">Items in this order</h2>

                <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700">
                  Quality checked
                </span>
              </div>

              <div className="mt-6 flex gap-5">
                <div className="flex h-32 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
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
                      <p>Storage: {product.storage}</p>
                    )}

                    {product.color && (
                      <p>Colour: {product.color}</p>
                    )}

                    {product.condition && (
                      <p>Condition: {product.condition}</p>
                    )}

                    <p>Quantity: {order.quantity || 1}</p>
                  </div>

                  <p className="mt-4 text-lg font-black text-gray-950">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* DELIVERY */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="font-black">Delivery address</h2>
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
                  <br />
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </p>

                <p className="mt-2 text-xs font-semibold text-gray-500">
                  Phone: {order.address.phone}
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
                  <h2 className="font-black">Payment information</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Payment details for this order.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Info
                  label="Payment method"
                  value={order.paymentMethod}
                />

                <Info
                  label="Payment status"
                  value={order.paymentStatus || "Confirmed"}
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <aside>
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">Order summary</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Item price</span>
                  <span className="font-semibold">
                    ₹{order.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Delivery</span>
                  <span className="font-semibold">
                    {order.deliveryFee === 0
                      ? "FREE"
                      : `₹${order.deliveryFee.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-black">Total</span>

                    <span className="text-xl font-black">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {order.expectedDelivery && (
                <div className="mt-6 rounded-2xl bg-green-50 p-4">
                  <div className="flex gap-3">
                    <Truck
                      size={19}
                      className="shrink-0 text-green-600"
                    />

                    <div>
                      <p className="text-xs font-black text-green-800">
                        Expected delivery
                      </p>

                      <p className="mt-1 text-sm font-bold text-green-700">
                        {order.expectedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <Link
                  href={`/track-order/${order.orderId}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  <Truck size={17} />
                  Track order
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
                  Your device is quality checked and covered by the
                  warranty mentioned on the product page.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

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