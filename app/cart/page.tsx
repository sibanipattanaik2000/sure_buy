"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";
export default function CartPage() {
  const router = useRouter();

  const {
    cartItems,
    cartCount,
    subtotal,
    originalTotal,
    savings,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { setProductsFromCart } = useCheckout();
  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[calc(100vh-72px)] bg-[#f7f8fa] px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[2rem] border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
              <ShoppingBag size={34} className="text-indigo-600" />
            </div>

            <h1 className="mt-7 text-3xl font-black tracking-tight text-gray-950">
              Your cart is empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Looks like you haven't added anything to your cart yet. Explore
              our quality-checked devices and find your next upgrade.
            </p>

            <Link
              href="/buy"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Continue shopping
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     CART
  ======================================================= */

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f8fa] text-gray-900">
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/buy"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={15} />
              Continue shopping
            </Link>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-gray-500 transition hover:text-red-500 sm:self-auto"
          >
            <Trash2 size={16} />
            Clear cart
          </button>
        </div>

        {/* MAIN GRID */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.cartId}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex gap-4 sm:gap-6">
                  {/* IMAGE */}

                  <Link
                    href={`/buy/${item.id}`}
                    className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-3 sm:h-36 sm:w-36"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain transition hover:scale-105"
                    />
                  </Link>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                          {item.brand}
                        </p>

                        <Link
                          href={`/buy/${item.id}`}
                          className="mt-1 block text-lg font-black text-gray-950 transition hover:text-indigo-600 sm:text-xl"
                        >
                          {item.name}
                        </Link>
                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartId)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {/* VARIANT */}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {item.storage}
                      </span>

                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                        {item.color}
                      </span>

                      <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                        {item.condition}
                      </span>
                    </div>

                    {/* PRICE */}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xl font-black text-gray-950">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>

                      {item.originalPrice > item.price && (
                        <span className="text-xs font-semibold text-gray-400 line-through">
                          ₹{item.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* BOTTOM */}

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* QUANTITY */}

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-500">
                          Quantity
                        </span>

                        <div className="flex h-10 items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.cartId)}
                            aria-label="Decrease quantity"
                            className="flex h-full w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="flex h-full min-w-10 items-center justify-center border-x border-gray-200 px-2 text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.cartId)}
                            aria-label="Increase quantity"
                            className="flex h-full w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>

                      {/* ITEM TOTAL */}

                      <div className="text-left sm:text-right">
                        <p className="text-xs font-semibold text-gray-400">
                          Item total
                        </p>

                        <p className="mt-1 text-base font-black text-gray-950">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* TRUST */}

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <TrustItem
                icon={<ShieldCheck size={18} />}
                title="Secure payment"
              />

              <TrustItem icon={<Truck size={18} />} title="Fast delivery" />

              <TrustItem icon={<Check size={18} />} title="Quality checked" />
            </div>
          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Order summary</h2>

              {/* SUBTOTAL */}

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">MRP</span>

                  <span className="font-semibold text-gray-700">
                    ₹{originalTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Discount</span>

                  <span className="font-semibold text-green-600">
                    - ₹{savings.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>

                  <span className="font-bold text-green-600">FREE</span>
                </div>
              </div>

              <div className="my-6 h-px bg-gray-100" />

              {/* TOTAL */}

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500">Total</p>

                  <p className="mt-1 text-xs text-gray-400">
                    Inclusive of applicable taxes
                  </p>
                </div>

                <p className="text-2xl font-black text-gray-950">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>

              {/* SAVINGS */}

              {savings > 0 && (
                <div className="mt-5 rounded-xl bg-green-50 px-4 py-3">
                  <p className="text-xs font-bold text-green-700">
                    You save ₹{savings.toLocaleString("en-IN")} on this order
                  </p>
                </div>
              )}

              {/* CHECKOUT */}

              <button
                type="button"
                onClick={() => {
                  setProductsFromCart(
                    cartItems.map((item) => ({
                      id: item.id,
                      name: item.name,
                      brand: item.brand,
                      category: item.category,
                      storage: item.storage,
                      color: item.color,
                      condition: item.condition,
                      price: item.price,
                      originalPrice: item.originalPrice,
                      warranty: item.warranty,
                      image: item.image,
                      quantity: item.quantity,
                      cartId: item.cartId,
                    })),
                  );

                  router.push("/checkout");
                }}
                className="group mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Proceed to checkout
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] font-semibold text-gray-400">
                <ShieldCheck size={14} />
                Secure checkout • Quality checked
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   TRUST ITEM
========================================================= */

function TrustItem({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="text-xs font-bold text-gray-600">{title}</p>
    </div>
  );
}
