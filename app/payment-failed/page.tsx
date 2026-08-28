"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";

export default function PaymentFailedPage() {
  const searchParams =
    useSearchParams();

  const orderId =
    searchParams.get("orderId");

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-16">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <AlertCircle
              size={32}
              className="text-red-600"
            />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-red-600">
            Payment unsuccessful
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950">
            We couldn't complete your payment
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Your payment was not confirmed. No successful
            payment has been recorded for this order.
          </p>

          {orderId && (
            <div className="mt-6 rounded-2xl bg-gray-50 px-5 py-4 text-left">
              <p className="text-xs font-semibold text-gray-400">
                Order ID
              </p>

              <p className="mt-1 break-all text-sm font-black text-gray-900">
                {orderId}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
            <ShieldCheck
              size={15}
              className="text-green-600"
            />
            Payment verification is handled securely
            by Phone Bhai.
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">

            <Link
              href={
                orderId
                  ? `/checkout?orderId=${encodeURIComponent(orderId)}`
                  : "/checkout"
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              <RefreshCcw size={16} />
              Try payment again
            </Link>

            <Link
              href="/buy"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Continue shopping
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}
