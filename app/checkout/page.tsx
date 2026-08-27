"use client";

import { FormEvent, useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import {
  ArrowRight,
  Check,
  CreditCard,
  Lock,
  MapPin,
  ShieldCheck,
  Truck,
  Wallet,
  Minus,
  Plus,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { DeliveryAddress, useCheckout } from "../context/CheckoutContext";
import {
  addCartItem,
  createAddress,
  createOrder,
  createPaymentOrder,
  getAddresses,
  verifyPayment,
} from "../lib/api";
export default function CheckoutPage() {
  const router = useRouter();

  const { checkout, setAddress, setPaymentMethod, clearCheckout } =
    useCheckout();

  const { clearCart } = useCart();
  const { products, paymentMethod } = checkout;

  const [form, setForm] = useState<DeliveryAddress>({
    fullName: "",
    phone: "",
    pincode: "",
    address: "",
    area: "",
    city: "",
    state: "",
  });
  useEffect(() => {
    try {
      const savedAddress = localStorage.getItem("phonebuy-saved-address");

      if (!savedAddress) {
        return;
      }

      const parsed = JSON.parse(savedAddress);

      if (parsed && typeof parsed === "object") {
        setForm({
          fullName: parsed.fullName || "",
          phone: parsed.phone || "",
          pincode: parsed.pincode || "",
          address: parsed.address || "",
          area: parsed.area || "",
          city: parsed.city || "",
          state: parsed.state || "",
        });
      }
    } catch (error) {
      console.error("Failed to load saved address:", error);
    }
  }, []);
  const [error, setError] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);

  /*
   * EMPTY CHECKOUT
   */

  if (!products || products.length === 0) {
    return (
      <>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />

        <main className="min-h-screen bg-[#f7f8fa] px-5 py-20">
          <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <ShieldCheck size={25} className="text-indigo-600" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-gray-900">
              Your checkout is empty
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Choose a product before proceeding to checkout.
            </p>

            <Link
              href="/buy"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Browse products
              <ArrowRight size={16} />
            </Link>
          </div>
        </main>
      </>
    );
  }

  /*
   * =====================================================
   * TOTALS
   * =====================================================
   *
   * Every calculation includes quantity.
   */

  const subtotal = products.reduce(
    (sum, product) => sum + product.price * Math.max(1, product.quantity || 1),
    0,
  );

  const originalTotal = products.reduce(
    (sum, product) =>
      sum + product.originalPrice * Math.max(1, product.quantity || 1),
    0,
  );

  const savings = originalTotal - subtotal;

  const deliveryCharge = 0;

  const total = subtotal + deliveryCharge;

  /*
   * TOTAL NUMBER OF PHYSICAL ITEMS
   */

  const totalQuantity = products.reduce(
    (sum, product) => sum + Math.max(1, product.quantity || 1),
    0,
  );

  /*
   * HANDLE INPUT
   */

  const handleChange = (field: keyof DeliveryAddress, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * SUBMIT
   */

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (placingOrder) {
      return;
    }

    /* =====================================================
     ADDRESS VALIDATION
  ===================================================== */

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const pincode = form.pincode.trim();
    const address = form.address.trim();
    const area = form.area.trim();
    const city = form.city.trim();
    const state = form.state.trim();

    if (
      !fullName ||
      !phone ||
      !pincode ||
      !address ||
      !area ||
      !city ||
      !state
    ) {
      setError("Please fill in all delivery address details.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (fullName.length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    if (city.length < 2) {
      setError("Please enter a valid city.");
      return;
    }

    if (state.length < 2) {
      setError("Please enter a valid state.");
      return;
    }

    /* =====================================================
     BUILD ADDRESS
  ===================================================== */

    const addressLine1 = `${address}, ${area}`.trim();

    if (addressLine1.length < 5) {
      setError("Please enter a complete delivery address.");
      return;
    }

    if (addressLine1.length > 200) {
      setError("Delivery address is too long. Please shorten it.");
      return;
    }

    /* =====================================================
     PAYMENT VALIDATION
  ===================================================== */

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setPlacingOrder(true);

    try {
      /* =====================================================
       GET EXISTING ADDRESSES
    ===================================================== */

      const addressesResponse = await getAddresses();

      if (!addressesResponse.success) {
        throw new Error(
          addressesResponse.message || "Unable to load saved addresses.",
        );
      }

      const savedAddresses = addressesResponse.data ?? [];

      /* =====================================================
       FIND EXISTING ADDRESS
    ===================================================== */

      const existingAddress = savedAddresses.find((savedAddress) => {
        const savedPostalCode = savedAddress.postalCode?.trim();
        return (
          savedAddress.fullName.trim().toLowerCase() ===
            fullName.toLowerCase() &&
          savedAddress.phone.trim() === phone &&
          savedAddress.addressLine1.trim().toLowerCase() ===
            addressLine1.toLowerCase() &&
          savedAddress.city.trim().toLowerCase() === city.toLowerCase() &&
          savedAddress.state.trim().toLowerCase() === state.toLowerCase() &&
          savedPostalCode === pincode
        );
      });

      let addressId: string;

      /* =====================================================
       USE EXISTING ADDRESS
    ===================================================== */

      if (existingAddress) {
        addressId = existingAddress.id;
      } else {
        /* ===================================================
         CREATE ADDRESS

         IMPORTANT:
         createAddress() in api.ts expects `pincode`.

         api.ts converts:
         pincode -> postalCode

         Backend expects:
         postalCode
         =================================================== */

        const addressPayload = {
          fullName,
          phone,
          addressLine1,
          city,
          state,
          postalCode: pincode,
          isDefault: savedAddresses.length === 0,
        };

        console.log("Creating checkout address:", addressPayload);

        const addressResponse = await createAddress(addressPayload);

        if (!addressResponse.success || !addressResponse.data) {
          throw new Error(
            addressResponse.message || "Unable to save delivery address.",
          );
        }

        addressId = addressResponse.data.id;
      }

      /* =====================================================
       KEEP CHECKOUT CONTEXT IN SYNC
    ===================================================== */

      setAddress({
        fullName,
        phone,
        pincode,
        address,
        area,
        city,
        state,
      });

      /* =====================================================
       NORMALIZE PAYMENT METHOD
    ===================================================== */

      const backendPaymentMethod =
        paymentMethod === "cod"
          ? "COD"
          : paymentMethod === "upi"
            ? "UPI"
            : paymentMethod === "emi"
              ? "EMI"
              : "CARD";

      /* =====================================================
   ENSURE PRODUCTS EXIST IN BACKEND CART
===================================================== */

      if (checkout.source === "buy-now") {
        const buyNowProduct = products[0];

        if (!buyNowProduct) {
          throw new Error("No product selected for checkout.");
        }

        console.log("Adding Buy Now product to backend cart:", {
          productId: buyNowProduct.id,
          variantId: buyNowProduct.variantId,
          quantity: buyNowProduct.quantity ?? 1,
        });

        const cartResponse = await addCartItem({
          productId: buyNowProduct.id,
          ...(buyNowProduct.variantId !== null &&
          buyNowProduct.variantId !== undefined
            ? {
                variantId: buyNowProduct.variantId,
              }
            : {}),
          quantity: Math.max(1, buyNowProduct.quantity || 1),
        });

        if (!cartResponse.success) {
          throw new Error(
            cartResponse.message || "Unable to add the product to your cart.",
          );
        }
      }

      /* =====================================================
   CREATE BACKEND ORDER
===================================================== */

      const orderResponse = await createOrder({
        addressId,
        paymentMethod: backendPaymentMethod,
      });

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || "Unable to place your order.");
      }

      const order = orderResponse.data;
/* =====================================================
   ONLINE PAYMENT
===================================================== */

if (backendPaymentMethod !== "COD") {
  const paymentOrderResponse =
    await createPaymentOrder(order.id);

  if (
    !paymentOrderResponse.success ||
    !paymentOrderResponse.data
  ) {
    throw new Error(
      paymentOrderResponse.message ||
        "Unable to start online payment.",
    );
  }

  const paymentOrder =
    paymentOrderResponse.data;

  if (!window.Razorpay) {
    throw new Error(
      "Payment gateway is still loading. Please try again.",
    );
  }

  await new Promise<void>((resolve, reject) => {
    let settled = false;

    const finishSuccess = async () => {
      if (settled) {
        return;
      }

      settled = true;

      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    const razorpay = new window.Razorpay({
      key: paymentOrder.keyId,

      amount: paymentOrder.amountInPaise,

      currency: paymentOrder.currency,

      name: "Phone Bhai",

      description:
        `Payment for order ${order.orderNumber}`,

      order_id:
        paymentOrder.razorpayOrderId,

      theme: {
        color: "#4f46e5",
      },

      handler: async (response) => {
        try {
          const verification =
            await verifyPayment(
              order.id,
              {
                razorpayPaymentId:
                  response.razorpay_payment_id,

                razorpayOrderId:
                  response.razorpay_order_id,

                razorpaySignature:
                  response.razorpay_signature,
              },
            );

          if (
            !verification.success ||
            !verification.data
          ) {
            throw new Error(
              verification.message ||
                "Payment verification failed.",
            );
          }

          await finishSuccess();
        } catch (verificationError) {
          if (!settled) {
            settled = true;
            reject(verificationError);
          }
        }
      },

      modal: {
        ondismiss: () => {
          if (settled) {
            return;
          }

          settled = true;

          reject(
            new Error(
              "Payment was cancelled. Your order is still pending.",
            ),
          );
        },
      },
    });

    razorpay.open();
  });
}
      /* =====================================================
       SUCCESS PAGE ADAPTER
    ===================================================== */
if (backendPaymentMethod !== "COD") {
  // create Razorpay order
  // open Razorpay
  // verify payment
  // only then continue
}
           /* =====================================================
       PAYMENT SUCCESS CONFIRMED
       ===================================================== */

      /*
       * For COD:
       *   create order -> clear cart -> success
       *
       * For online payment:
       *   create order -> Razorpay -> verify signature
       *   -> clear cart -> success
       *
       * Therefore this section is reached only after
       * successful payment verification for online orders.
       */

      const firstItem = order.items?.[0];

      sessionStorage.setItem(
        "PhoneBhai-order",
        JSON.stringify({
          orderId: order.orderNumber || order.id,

          productName:
            firstItem?.productName || "",

          productImage:
            firstItem?.imageUrl || "",

          brand:
            firstItem?.brand || "",

          storage:
            firstItem?.storage || "",

          color:
            firstItem?.color || "",

          price:
            firstItem?.unitPrice || 0,

          paymentMethod:
            backendPaymentMethod,

          deliveryDate:
            "3–5 business days",
        }),
      );

      /* =====================================================
       CLEAR CLIENT STATE
       ===================================================== */

      try {
        await clearCart();
      } catch (cartError) {
        /*
         * The order/payment has already succeeded.
         * Cart cleanup failure must never prevent the
         * customer from reaching the success page.
         */
        console.warn(
          "Cart cleanup skipped after successful order:",
          cartError,
        );
      }

      clearCheckout();

      /* =====================================================
       REDIRECT
       ===================================================== */

      router.replace(
        `/order-success?orderId=${encodeURIComponent(
          order.id,
        )}`,
      );
    } catch (requestError) {
      console.error("Failed to place order:", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while placing your order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl px-5 py-8 lg:px-8"
      >
        {/* TITLE */}

        <div className="mb-8">
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Complete your purchase
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} • Enter
            your delivery details and choose your preferred payment method.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* LEFT */}

          <div className="space-y-7">
            {/* ADDRESS */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Delivery address</h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Where should we deliver your device?
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(value) => handleChange("fullName", value)}
                />

                <Input
                  label="Mobile number"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  maxLength={10}
                  type="tel"
                  onChange={(value) =>
                    handleChange("phone", value.replace(/\D/g, ""))
                  }
                />

                <Input
                  label="PIN code"
                  placeholder="6-digit PIN code"
                  value={form.pincode}
                  maxLength={6}
                  type="tel"
                  onChange={(value) =>
                    handleChange("pincode", value.replace(/\D/g, ""))
                  }
                />

                <Input
                  label="City"
                  placeholder="Enter city"
                  value={form.city}
                  onChange={(value) => handleChange("city", value)}
                />

                <Input
                  label="State"
                  placeholder="Enter state"
                  value={form.state}
                  onChange={(value) => handleChange("state", value)}
                />

                <Input
                  label="Area / Locality"
                  placeholder="Enter area"
                  value={form.area}
                  onChange={(value) => handleChange("area", value)}
                />

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700">
                    House / Flat / Street address
                  </label>

                  <textarea
                    value={form.address}
                    onChange={(event) =>
                      handleChange("address", event.target.value)
                    }
                    placeholder="House number, building, street..."
                    rows={3}
                    className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>
            </section>

            {/* PRODUCTS */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black">Products</h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {products.length}{" "}
                    {products.length === 1 ? "product" : "products"} •{" "}
                    {totalQuantity} total items
                  </p>
                </div>

                <Link
                  href="/cart"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Change
                </Link>
              </div>

              <div className="mt-5 space-y-5">
                {products.map((product) => {
                  const quantity = Math.max(1, product.quantity || 1);

                  const itemTotal = product.price * quantity;

                  return (
                    <div
                      key={
                        product.cartId ||
                        `${product.id}-${product.storage}-${product.color}-${product.name}`
                      }
                      className="flex gap-4 border-b border-gray-100 pb-5 last:border-0 last:pb-0"
                    >
                      {/* IMAGE */}

                      <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {product.brand}
                        </p>

                        <h3 className="mt-1 text-base font-black">
                          {product.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold">
                            {product.storage}
                          </span>

                          <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold">
                            {product.color}
                          </span>

                          <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            {product.condition}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <p className="text-lg font-black">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>

                          <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                            Qty: {quantity}
                          </span>

                          <span className="text-xs font-semibold text-gray-400">
                            Total: ₹{itemTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Payment method</h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Choose how you want to pay.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <PaymentOption
                  active={paymentMethod === "upi"}
                  onClick={() => setPaymentMethod("upi")}
                  icon={<Wallet size={19} />}
                  title="UPI"
                  description="Pay using your UPI app"
                />

                <PaymentOption
                  active={paymentMethod === "card"}
                  onClick={() => setPaymentMethod("card")}
                  icon={<CreditCard size={19} />}
                  title="Credit / Debit Card"
                  description="Secure card payment"
                />

                <PaymentOption
                  active={paymentMethod === "emi"}
                  onClick={() => setPaymentMethod("emi")}
                  icon={<CreditCard size={19} />}
                  title="EMI"
                  description="Pay monthly with eligible cards"
                />

                <PaymentOption
                  active={paymentMethod === "cod"}
                  onClick={() => setPaymentMethod("cod")}
                  icon={<Truck size={19} />}
                  title="Cash on Delivery"
                  description="Pay when your device arrives"
                />
              </div>
            </section>
          </div>

          {/* RIGHT */}

          <aside>
            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black">Price details</h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">MRP</span>

                  <span className="font-semibold">
                    ₹{originalTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>

                  <span className="font-semibold text-green-600">
                    - ₹{savings.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>

                  <span className="font-bold text-green-600">FREE</span>
                </div>
              </div>

              <div className="my-5 border-t border-gray-100" />

              <div className="flex items-center justify-between">
                <span className="font-black">Total amount</span>

                <span className="text-2xl font-black">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-green-50 p-4">
                <div className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-green-600" />

                  <div>
                    <p className="text-xs font-bold text-green-700">
                      You save ₹{savings.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-green-600">
                      Free delivery included.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {placingOrder ? "Processing..." : "Place order"}

                {!placingOrder && <ArrowRight size={18} />}
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-500">
                <Lock size={13} />
                Secure and encrypted checkout
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5">
                <MiniTrust
                  icon={<ShieldCheck size={16} />}
                  text="Quality checked"
                />

                <MiniTrust icon={<Truck size={16} />} text="Fast delivery" />

                <MiniTrust
                  icon={<Check size={16} />}
                  text={products[0]?.warranty || "Warranty"}
                />
              </div>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}

/* INPUT */

function Input({
  label,
  placeholder,
  value,
  onChange,
  maxLength,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-700">{label}</label>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
      />
    </div>
  );
}

/* PAYMENT */

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
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

/* TRUST */

function MiniTrust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center">
      <div className="flex justify-center text-indigo-600">{icon}</div>

      <p className="mt-2 text-[9px] font-bold text-gray-500">{text}</p>
    </div>
  );
}
