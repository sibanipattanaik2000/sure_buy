"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

type OrderData = {
  orderId: string;
  productName: string;
  productImage: string;
  brand: string;
  storage: string;
  color: string;
  price: number;
  paymentMethod: string;
  deliveryDate: string;
};
export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [orderLoadFailed, setOrderLoadFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  useEffect(() => {
    try {
      const storedOrder = sessionStorage.getItem("PhoneBhai-order");

      if (!storedOrder) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrderLoadFailed(true);
        return;
      }

      const parsed = JSON.parse(storedOrder);

      if (!parsed || typeof parsed !== "object" || !parsed.orderId) {
        console.error("Invalid order data received.");

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOrderLoadFailed(true);

        return;
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrder({
        orderId: String(parsed.orderId),

        productName: String(parsed.productName || ""),

        productImage: String(parsed.productImage || ""),

        brand: String(parsed.brand || ""),

        storage: String(parsed.storage || ""),

        color: String(parsed.color || ""),

        price: Number(parsed.price || 0),

        paymentMethod: String(parsed.paymentMethod || ""),

        deliveryDate: String(parsed.deliveryDate || "3–5 business days"),
      });
    } catch (error) {
      console.error("Failed to load order:", error);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderLoadFailed(true);
    }
  }, []);

  const copyOrderId = async () => {
    if (!order?.orderId) return;

    try {
      await navigator.clipboard.writeText(order.orderId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy order ID:", error);
    }
  };

  /*
   * IMPORTANT:
   * Don't render order-specific information before
   * the client has loaded it.
   */
if (!order && !orderLoadFailed) {
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

      <section className="mx-auto max-w-3xl px-5 py-16">
        <div className="animate-pulse">
          <div className="mx-auto h-20 w-20 rounded-full bg-gray-200" />

          <div className="mx-auto mt-6 h-8 max-w-sm rounded bg-gray-200" />

          <div className="mx-auto mt-3 h-4 max-w-md rounded bg-gray-200" />

          <div className="mt-10 h-64 rounded-3xl bg-gray-200" />

          <div className="mt-5 h-40 rounded-3xl bg-gray-200" />
        </div>
      </section>
    </main>
  );
}

if (!order && orderLoadFailed) {
  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      <section className="mx-auto max-w-xl px-5 py-20">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Package
              size={28}
              className="text-gray-500"
            />
          </div>

          <h1 className="mt-6 text-2xl font-black text-gray-950">
            Order details unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            We couldn't load the order details for this
            checkout session. Please check your orders or
            continue shopping.
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

/* ORDER STEP */

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
    <div className="flex gap-4">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-black">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
      </div>
    </div>
  );
}

/* TRUST ITEM */

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
}