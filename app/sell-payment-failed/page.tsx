"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";

export default function SellPaymentFailedPage() {
  const searchParams = useSearchParams();

  const sellRequestId =
    searchParams.get("sellRequestId");

  const reason =
    searchParams.get("reason") ||
    "We couldn't complete your payment.";

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
          <XCircle className="w-11 h-11 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mt-6">
          Payment Failed
        </h1>

        <p className="text-gray-600 mt-3">
          Your payment could not be completed.
          No successful payment has been recorded.
        </p>

        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-left">
          <p className="text-sm font-medium text-red-900">
            Reason
          </p>

          <p className="text-sm text-red-700 mt-1">
            {reason}
          </p>
        </div>

        {sellRequestId && (
          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 text-left">
            <p className="text-xs text-gray-500">
              SELL REQUEST ID
            </p>

            <p className="font-medium text-gray-900 mt-1 break-all">
              {sellRequestId}
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {sellRequestId && (
            <Link
              href={`/sell/payment?sellRequestId=${encodeURIComponent(
                sellRequestId
              )}`}
              className="py-3 px-4 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Link>
          )}

          <Link
            href="/sell"
            className="py-3 px-4 rounded-xl border border-gray-300 font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sell
          </Link>
        </div>
      </div>
    </main>
  );
}