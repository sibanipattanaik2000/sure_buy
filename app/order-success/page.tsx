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

function generateOrderId() {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `SB-${random}`;
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  
  const [copied, setCopied] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  useEffect(() => {
    /*
     * In a real application this data should come from your
     * backend/order API.
     *
     * For now we read the checkout data from sessionStorage.
     */

    try {
      const storedOrder = sessionStorage.getItem("PhoneBhai-order");

      if (storedOrder) {
        const parsed = JSON.parse(storedOrder);

       // eslint-disable-next-line react-hooks/set-state-in-effect
setOrder({
  ...parsed,
  orderId: parsed.orderId || generateOrderId(),
});

        return;
      }
    } catch (error) {
      console.error("Failed to load order:", error);
    }

    /*
     * Fallback demo order.
     * The ID is generated ONLY after mounting,
     * preventing hydration mismatch.
     */

// eslint-disable-next-line react-hooks/set-state-in-effect
setOrder({
  orderId: generateOrderId(),
  productName: "iPhone 15",
  productImage: "/images/iphone-15.png",
  brand: "Apple",
  storage: "128GB",
  color: "Black",
  price: 42999,
  paymentMethod: "UPI",
  deliveryDate: "3–5 business days",
});
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
  if (!order) {
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

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      {/* SUCCESS */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center">
          {/* SUCCESS ICON */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2
              size={48}
              className="text-green-600"
              strokeWidth={1.8}
            />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-green-600">
            Order confirmed
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Thank you for your order!
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
            Your order has been successfully placed. We’ll carefully inspect,
            pack and ship your device to you.
          </p>

          {/* ORDER ID */}

          <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 text-left">
            <div className="border-r border-gray-200 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Order ID
              </p>

              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm font-black text-gray-900">
                  {order.orderId}
                </p>

                <button
                  type="button"
                  onClick={copyOrderId}
                  aria-label="Copy order ID"
                  className="text-gray-400 transition hover:text-indigo-600"
                >
                  {copied ? (
                    <Check size={15} className="text-green-600" />
                  ) : (
                    <Clipboard size={15} />
                  )}
                </button>
              </div>
            </div>

            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Payment
              </p>

              <p className="mt-1 text-sm font-black text-gray-900">
                {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* ORDER ITEM */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black">Order summary</h2>

                <p className="mt-1 text-xs text-gray-500">
                  Your purchased item
                </p>
              </div>

              <Package size={22} className="text-indigo-600" />
            </div>

            {/* PRODUCT */}

            <div className="mt-6 flex gap-5 rounded-2xl bg-gray-50 p-4">
              <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-3">
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {order.brand}
                </p>

                <h3 className="mt-1 text-base font-black text-gray-950">
                  {order.productName}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                    {order.storage}
                  </span>

                  <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                    {order.color}
                  </span>
                </div>

                <p className="mt-4 text-lg font-black">
                  ₹{order.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* TOTAL */}

            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Item price</span>

                <span className="text-sm font-semibold">
                  ₹{order.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">Delivery</span>

                <span className="text-sm font-bold text-green-600">FREE</span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="font-black">Total paid</span>

                <span className="text-xl font-black">
                  ₹{order.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* DELIVERY */}

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Truck size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-black">Delivery details</h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Estimated delivery
                  </p>
                </div>
              </div>

              <p className="mt-5 text-base font-black">{order.deliveryDate}</p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                You’ll receive tracking details once your order has been
                shipped.
              </p>
            </div>

            {/* PAYMENT */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-black">Payment</h2>

                  <p className="mt-1 text-xs text-gray-500">Payment method</p>
                </div>
              </div>

              <p className="mt-5 text-sm font-black">{order.paymentMethod}</p>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3">
                <CheckCircle2 size={15} className="text-green-600" />

                <span className="text-xs font-semibold text-green-700">
                  Payment confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER TRACKING */}

        <section className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <h2 className="text-lg font-black">What happens next?</h2>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <OrderStep
              active
              icon={<Check size={18} />}
              title="Order confirmed"
              text="Your order has been successfully placed."
            />

            <OrderStep
              icon={<Package size={18} />}
              title="Preparing order"
              text="Our team will inspect and carefully pack your device."
            />

            <OrderStep
              icon={<Truck size={18} />}
              title="Out for delivery"
              text="Your phone will be shipped to your delivery address."
            />
          </div>
        </section>

        {/* TRUST */}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <TrustItem
            icon={<ShieldCheck size={18} />}
            title="Secure purchase"
            text="Your payment and order details are protected."
          />

          <TrustItem
            icon={<Package size={18} />}
            title="Quality checked"
            text="Every device goes through our inspection process."
          />

          <TrustItem
            icon={<ShoppingBag size={18} />}
            title="Warranty backed"
            text="Your device comes with the listed warranty."
          />
        </div>

        {/* ACTIONS */}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {/* TRACK ORDER */}
          <Link
            href={`/track-order/${order.orderId}`}
            onClick={() => setActiveButton("track")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition ${
              activeButton === "track"
                ? "border-indigo-600 bg-white text-indigo-600"
                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            <Truck size={17} />
            Track order
          </Link>

          {/* VIEW ORDER */}
          <Link
            href={`/orders/${order.orderId}`}
            onClick={() => setActiveButton("view")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition ${
              activeButton === "view"
                ? "border-indigo-600 bg-white text-indigo-600"
                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            <Package size={17} />
            View order
          </Link>

          {/* CONTINUE SHOPPING */}
          <Link
            href="/buy"
            onClick={() => setActiveButton("shopping")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition ${
              activeButton === "shopping"
                ? "border-indigo-600 bg-white text-indigo-600"
                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            Continue shopping
            <ArrowRight size={17} />
          </Link>

          {/* BACK TO HOME */}
          <Link
            href="/"
            onClick={() => setActiveButton("home")}
            className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition ${
              activeButton === "home"
                ? "border-indigo-600 bg-white text-indigo-600"
                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-600 hover:text-indigo-600"
            }`}
          >
            <ArrowLeft size={17} />
            Back To Home
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Need help with your order? Contact PhoneBhai support.
        </p>
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
