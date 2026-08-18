"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

type OrderProduct = {
  id: string;
  name: string;
  brand: string;
  image: string;
  storage?: string;
  color?: string;
  price: number;
};

type Order = {
  orderId: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  product: OrderProduct;
  quantity: number;
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

export default function TrackOrderPage() {
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

  const currentStep = useMemo(() => {
    if (!order) return 0;

    const status = order.status.toLowerCase();

    if (status.includes("deliver")) return 5;
    if (status.includes("out")) return 4;
    if (status.includes("ship")) return 3;
    if (status.includes("pack")) return 2;
    if (status.includes("payment")) return 1;

    return 0;
  }, [order]);

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

          <h1 className="mt-6 text-2xl font-black">
            Order not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            We couldn't find tracking information for this order.
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

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href={`/orders/${order.orderId}`}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black"
          >
            <ArrowLeft size={17} />
            Order details
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <ShieldCheck size={16} className="text-green-600" />
            Secure tracking
          </div>
        </div>
      </header>

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
            <span className="font-bold text-gray-900">
              {order.orderId}
            </span>
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
                  {order.status || "Order confirmed"}
                </h2>
              </div>
            </div>

            {order.expectedDelivery && (
              <div className="rounded-2xl bg-green-50 px-5 py-4">
                <p className="text-xs font-bold text-green-700">
                  Expected delivery
                </p>

                <p className="mt-1 text-sm font-black text-green-800">
                  {order.expectedDelivery}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TIMELINE */}

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-black">
            Delivery progress
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Follow your order from confirmation to delivery.
          </p>

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
                        index < currentStep
                          ? "bg-indigo-600"
                          : "bg-gray-200"
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
                          completed
                            ? "text-gray-950"
                            : "text-gray-400"
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
        </div>

        {/* PRODUCT + ADDRESS */}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* PRODUCT */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">
              Your item
            </h2>

            <div className="mt-5 flex gap-4">
              <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-3">
                <img
                  src={order.product.image}
                  alt={order.product.name}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {order.product.brand}
                </p>

                <h3 className="mt-1 font-black">
                  {order.product.name}
                </h3>

                {order.product.storage && (
                  <p className="mt-1 text-xs text-gray-500">
                    {order.product.storage}
                  </p>
                )}

                {order.product.color && (
                  <p className="mt-1 text-xs text-gray-500">
                    {order.product.color}
                  </p>
                )}

                <p className="mt-3 text-sm font-black">
                  ₹{order.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* ADDRESS */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black">
              Delivery address
            </h2>

            <div className="mt-5 flex gap-3">
              <MapPin
                size={19}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <div>
                <p className="text-sm font-black">
                  {order.address.name}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {order.address.address}
                  <br />
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </p>

                <p className="mt-2 text-xs font-semibold text-gray-500">
                  {order.address.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/orders/${order.orderId}`}
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