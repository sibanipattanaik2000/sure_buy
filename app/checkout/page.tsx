"use client";

import {
  FormEvent,
  useState,
} from "react";

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

import {
  DeliveryAddress,
  useCheckout,
} from "../context/CheckoutContext";

export default function CheckoutPage() {
  const router = useRouter();

const {
  checkout,
  setAddress,
  setPaymentMethod,
  clearCheckout,
} = useCheckout();

const { clearCart } = useCart();
  const {
    products,
    paymentMethod,
  } = checkout;

  const [form, setForm] =
    useState<DeliveryAddress>({
      fullName: "",
      phone: "",
      pincode: "",
      address: "",
      area: "",
      city: "",
      state: "",
    });

  const [error, setError] =
    useState("");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  /*
   * EMPTY CHECKOUT
   */

  if (
    !products ||
    products.length === 0
  ) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-5 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
            <ShieldCheck
              size={25}
              className="text-indigo-600"
            />
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-900">
            Your checkout is empty
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Choose a product before
            proceeding to checkout.
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
    );
  }

  /*
   * =====================================================
   * TOTALS
   * =====================================================
   *
   * Every calculation includes quantity.
   */

  const subtotal =
    products.reduce(
      (sum, product) =>
        sum +
        product.price *
          Math.max(
            1,
            product.quantity || 1,
          ),
      0,
    );

  const originalTotal =
    products.reduce(
      (sum, product) =>
        sum +
        product.originalPrice *
          Math.max(
            1,
            product.quantity || 1,
          ),
      0,
    );

  const savings =
    originalTotal - subtotal;

  const deliveryCharge = 0;

  const total =
    subtotal + deliveryCharge;

  /*
   * TOTAL NUMBER OF PHYSICAL ITEMS
   */

  const totalQuantity =
    products.reduce(
      (sum, product) =>
        sum +
        Math.max(
          1,
          product.quantity || 1,
        ),
      0,
    );

  /*
   * HANDLE INPUT
   */

  const handleChange = (
    field: keyof DeliveryAddress,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * SUBMIT
   */

const handleSubmit = (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setError("");

  if (placingOrder) {
    return;
  }

  /*
   * ADDRESS VALIDATION
   */

  if (
    !form.fullName.trim() ||
    !form.phone.trim() ||
    !form.pincode.trim() ||
    !form.address.trim() ||
    !form.area.trim() ||
    !form.city.trim() ||
    !form.state.trim()
  ) {
    setError(
      "Please fill in all delivery address details.",
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    return;
  }

  /*
   * PHONE
   */

  if (form.phone.length !== 10) {
    setError(
      "Please enter a valid 10-digit mobile number.",
    );

    return;
  }

  /*
   * PIN
   */

  if (form.pincode.length !== 6) {
    setError(
      "Please enter a valid 6-digit PIN code.",
    );

    return;
  }

  /*
   * PAYMENT
   */

  if (!paymentMethod) {
    setError(
      "Please select a payment method.",
    );

    return;
  }

  /*
   * SAVE ADDRESS
   */

  setAddress(form);

  setPlacingOrder(true);

  /*
   * CREATE ORDER
   *
   * The same order is stored in the formats
   * required by:
   *
   * - Order Success
   * - My Orders
   * - View Order
   * - Track Order
   */

  const orderId = `SB-${Math.floor(
    10000000 + Math.random() * 90000000,
  )}`;

  const createdAt = new Date().toISOString();

  const deliveryDate = "3–5 business days";

  const firstProduct = products[0];

  const orderRecord = {
    id: orderId,
    orderId,

    productId: firstProduct.id,

    productName: firstProduct.name,
    brand: firstProduct.brand,
    image: firstProduct.image,

    storage: firstProduct.storage,
    color: firstProduct.color,

    price: firstProduct.price,

    paymentMethod,
    paymentStatus: "Confirmed",

    orderDate: new Date().toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    ),

    createdAt,

    deliveryDate,
    expectedDelivery: deliveryDate,

    status: "Confirmed",

    product: {
      id: firstProduct.id,
      name: firstProduct.name,
      brand: firstProduct.brand,
      image: firstProduct.image,
      storage: firstProduct.storage,
      color: firstProduct.color,
      condition: firstProduct.condition,
      price: firstProduct.price,
      quantity: Math.max(
        1,
        firstProduct.quantity || 1,
      ),
    },

    quantity: totalQuantity,

    subtotal,
    deliveryFee: deliveryCharge,
    total,

    address: {
      name: form.fullName,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    },

    products,
  };

  try {
    /*
     * Save current order.
     *
     * View Order and Track Order read this key.
     */

    localStorage.setItem(
      "phonebuy-order",
      JSON.stringify(orderRecord),
    );

    /*
     * Save order history.
     *
     * My Orders reads this key.
     */

    const existingOrdersRaw =
      localStorage.getItem(
        "surebuy-orders",
      );

    const existingOrders = existingOrdersRaw
      ? JSON.parse(existingOrdersRaw)
      : [];

    const orders = Array.isArray(existingOrders)
      ? existingOrders
      : [];

    localStorage.setItem(
      "surebuy-orders",
      JSON.stringify([
        orderRecord,
        ...orders.filter(
          (order: { id?: string }) =>
            order.id !== orderId,
        ),
      ]),
    );

    /*
     * Save order for Order Success.
     */

    sessionStorage.setItem(
      "surebuy-order",
      JSON.stringify({
        orderId,
        productName: firstProduct.name,
        productImage: firstProduct.image,
        brand: firstProduct.brand,
        storage: firstProduct.storage,
        color: firstProduct.color,
        price: total,
        paymentMethod,
        deliveryDate,
      }),
    );

    /*
     * Clear purchased cart items.
     *
     * The order has already been saved above,
     * so clearing the cart cannot lose the order.
     */

    clearCart();

    /*
     * Clear checkout storage/state.
     */

    localStorage.removeItem(
      "phonebuy-checkout",
    );

    /*
     * Redirect after successful order creation.
     */

    setTimeout(() => {
      router.push("/order-success");
    }, 900);
  } catch (error) {
    console.error(
      "Failed to place order:",
      error,
    );

    setPlacingOrder(false);

    setError(
      "Unable to place your order. Please try again.",
    );
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
            {totalQuantity}{" "}
            {totalQuantity === 1
              ? "item"
              : "items"}{" "}
            • Enter your delivery
            details and choose your
            preferred payment method.
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
                  <h2 className="text-lg font-black">
                    Delivery address
                  </h2>

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
                  onChange={(value) =>
                    handleChange(
                      "fullName",
                      value,
                    )
                  }
                />

                <Input
                  label="Mobile number"
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  maxLength={10}
                  type="tel"
                  onChange={(value) =>
                    handleChange(
                      "phone",
                      value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                />

                <Input
                  label="PIN code"
                  placeholder="6-digit PIN code"
                  value={form.pincode}
                  maxLength={6}
                  type="tel"
                  onChange={(value) =>
                    handleChange(
                      "pincode",
                      value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                />

                <Input
                  label="City"
                  placeholder="Enter city"
                  value={form.city}
                  onChange={(value) =>
                    handleChange(
                      "city",
                      value,
                    )
                  }
                />

                <Input
                  label="State"
                  placeholder="Enter state"
                  value={form.state}
                  onChange={(value) =>
                    handleChange(
                      "state",
                      value,
                    )
                  }
                />

                <Input
                  label="Area / Locality"
                  placeholder="Enter area"
                  value={form.area}
                  onChange={(value) =>
                    handleChange(
                      "area",
                      value,
                    )
                  }
                />

                <div className="sm:col-span-2">

                  <label className="text-xs font-bold text-gray-700">
                    House / Flat / Street address
                  </label>

                  <textarea
                    value={form.address}
                    onChange={(event) =>
                      handleChange(
                        "address",
                        event.target.value,
                      )
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
                  <h2 className="text-lg font-black">
                    Products
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {products.length}{" "}
                    {products.length === 1
                      ? "product"
                      : "products"}{" "}
                    • {totalQuantity}{" "}
                    total items
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

                {products.map(
                  (product) => {

                    const quantity =
                      Math.max(
                        1,
                        product.quantity ||
                          1,
                      );

                    const itemTotal =
                      product.price *
                      quantity;

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
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                            className="h-full w-full object-contain"
                          />

                        </div>

                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            {
                              product.brand
                            }
                          </p>

                          <h3 className="mt-1 text-base font-black">
                            {
                              product.name
                            }
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-2">

                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold">
                              {
                                product.storage
                              }
                            </span>

                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold">
                              {
                                product.color
                              }
                            </span>

                            <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                              {
                                product.condition
                              }
                            </span>

                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-3">

                            <p className="text-lg font-black">
                              ₹
                              {product.price.toLocaleString(
                                "en-IN",
                              )}
                            </p>

                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600">
                              Qty:{" "}
                              {quantity}
                            </span>

                            <span className="text-xs font-semibold text-gray-400">
                              Total: ₹
                              {itemTotal.toLocaleString(
                                "en-IN",
                              )}
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  },
                )}

              </div>

            </section>

            {/* PAYMENT */}

            <section className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <CreditCard size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    Payment method
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Choose how you want to pay.
                  </p>
                </div>

              </div>

              <div className="mt-6 grid gap-3">

                <PaymentOption
                  active={
                    paymentMethod ===
                    "upi"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "upi",
                    )
                  }
                  icon={
                    <Wallet size={19} />
                  }
                  title="UPI"
                  description="Google Pay, PhonePe, Paytm and other UPI apps"
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "card"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "card",
                    )
                  }
                  icon={
                    <CreditCard
                      size={19}
                    />
                  }
                  title="Credit / Debit Card"
                  description="Secure card payment"
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "emi"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "emi",
                    )
                  }
                  icon={
                    <CreditCard
                      size={19}
                    />
                  }
                  title="EMI"
                  description="Pay monthly with eligible cards"
                />

                <PaymentOption
                  active={
                    paymentMethod ===
                    "cod"
                  }
                  onClick={() =>
                    setPaymentMethod(
                      "cod",
                    )
                  }
                  icon={
                    <Truck size={19} />
                  }
                  title="Cash on Delivery"
                  description="Pay when your device arrives"
                />

              </div>

            </section>

          </div>

          {/* RIGHT */}

          <aside>

            <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-black">
                Price details
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    MRP
                  </span>

                  <span className="font-semibold">
                    ₹
                    {originalTotal.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Discount
                  </span>

                  <span className="font-semibold text-green-600">
                    - ₹
                    {savings.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Delivery
                  </span>

                  <span className="font-bold text-green-600">
                    FREE
                  </span>
                </div>

              </div>

              <div className="my-5 border-t border-gray-100" />

              <div className="flex items-center justify-between">

                <span className="font-black">
                  Total amount
                </span>

                <span className="text-2xl font-black">
                  ₹
                  {total.toLocaleString(
                    "en-IN",
                  )}
                </span>

              </div>

              <div className="mt-5 rounded-2xl bg-green-50 p-4">

                <div className="flex gap-3">

                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>

                    <p className="text-xs font-bold text-green-700">
                      You save ₹
                      {savings.toLocaleString(
                        "en-IN",
                      )}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-green-600">
                      Free delivery included.
                    </p>

                  </div>

                </div>

              </div>

              <button
                type="submit"
                disabled={
                  placingOrder
                }
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >

                {placingOrder
                  ? "Processing..."
                  : "Place order"}

                {!placingOrder && (
                  <ArrowRight
                    size={18}
                  />
                )}

              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-500">
                <Lock size={13} />
                Secure and encrypted checkout
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5">

                <MiniTrust
                  icon={
                    <ShieldCheck
                      size={16}
                    />
                  }
                  text="Quality checked"
                />

                <MiniTrust
                  icon={
                    <Truck size={16} />
                  }
                  text="Fast delivery"
                />

                <MiniTrust
                  icon={
                    <Check size={16} />
                  }
                  text={
                    products[0]
                      ?.warranty ||
                    "Warranty"
                  }
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
  onChange: (
    value: string,
  ) => void;
  maxLength?: number;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
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
          active
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div className="flex-1">

        <p className="text-sm font-bold">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>

      </div>

      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          active
            ? "border-indigo-600 bg-indigo-600"
            : "border-gray-300"
        }`}
      >
        {active && (
          <Check
            size={12}
            className="text-white"
          />
        )}
      </div>

    </button>
  );
}

/* TRUST */

function MiniTrust({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="text-center">

      <div className="flex justify-center text-indigo-600">
        {icon}
      </div>

      <p className="mt-2 text-[9px] font-bold text-gray-500">
        {text}
      </p>

    </div>
  );
}