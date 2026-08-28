"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  ApiError,
  getOrder,
} from "@/app/lib/api";

export default function SellPaymentPage() {
  const searchParams = useSearchParams();

  const requestId =
    searchParams.get("requestId");

  const [paymentMethod, setPaymentMethod] =
    useState<"UPI" | "CARD">("UPI");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handlePayment() {
    setError("");

    /*
     * Payment gateway integration belongs here.
     *
     * Do not mark the sell request as paid from the browser.
     * The backend must create/verify the gateway payment.
     */

    setLoading(true);

    try {
      /*
       * TODO:
       *
       * 1. POST /sell/payments/create
       * 2. Backend creates Razorpay/other payment order
       * 3. Open gateway checkout
       * 4. Gateway returns payment details
       * 5. POST /sell/payments/verify
       * 6. Backend verifies signature
       * 7. Redirect to confirmation
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 600),
      );

      setError(
        "Payment gateway is not connected yet. Your sell request was created successfully; payment integration will be connected through the backend next.",
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          "Unable to start payment. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (!requestId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5">
        <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-black text-gray-800">
            Invalid payment request
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            We could not find the sell request required for
            payment.
          </p>

          <Link
            href="/sell"
            className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            Return to Sell
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to Sell
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
              <ShieldCheck
                className="text-indigo-600"
                size={23}
              />
            </div>

            <h1 className="mt-5 text-3xl font-black">
              Secure pickup payment
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Pay the ₹500 pickup booking fee securely to
              confirm your doorstep pickup.
            </p>

            <div className="mt-8 space-y-3">
              <PaymentOption
                selected={paymentMethod === "UPI"}
                onClick={() =>
                  setPaymentMethod("UPI")
                }
                icon={<Wallet size={20} />}
                title="UPI"
                description="Google Pay, PhonePe, Paytm and other UPI apps"
              />

              <PaymentOption
                selected={paymentMethod === "CARD"}
                onClick={() =>
                  setPaymentMethod("CARD")
                }
                icon={<CreditCard size={20} />}
                title="Card"
                description="Credit or debit card"
              />
            </div>

            {error && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Starting secure payment...
                </>
              ) : (
                <>
                  Pay ₹500 securely
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck size={14} />
              Secure payment • Payment verification is handled
              by the server
            </div>
          </div>

          <div className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Payment summary
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <Smartphone
                  size={19}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Pickup booking
                </p>

                <p className="text-xs text-gray-400">
                  Sell request #{requestId}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Booking fee
                </span>

                <span className="font-black">
                  ₹500
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="font-bold">
                  Total
                </span>

                <span className="text-xl font-black">
                  ₹500
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PaymentOption({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
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
        selected
          ? "border-indigo-600 bg-indigo-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          selected
            ? "bg-indigo-600 text-white"
            : "bg-gray-100 text-gray-600"
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

      {selected && (
        <CheckCircle2
          size={20}
          className="text-indigo-600"
        />
      )}
    </button>
  );
}