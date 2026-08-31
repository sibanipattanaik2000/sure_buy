
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  RefreshCcw,
  ArrowLeft,
  Loader2,
} from "lucide-react";

function SellPaymentFailedContent() {
  const searchParams = useSearchParams();

  const requestId =
    searchParams.get("requestId") ||
    searchParams.get("sellRequestId");

  const reason =
    searchParams.get("reason") ||
    "We couldn't complete your payment.";

  const getReasonMessage = () => {
    switch (reason) {
      case "cancelled":
        return "You cancelled the Razorpay payment. No successful payment has been recorded.";

      case "payment_failed":
        return "Razorpay could not complete the payment. Please try again.";

      case "verification_failed":
        return "The payment was received, but we could not verify it successfully. Please try again or contact support if money was deducted.";

      default:
        return reason;
    }
  };

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
          Your payment could not be completed. No successful payment has been
          recorded.
        </p>

        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-left">
          <p className="text-sm font-medium text-red-900">
            Payment status
          </p>

          <p className="text-sm text-red-700 mt-1">
            {getReasonMessage()}
          </p>
        </div>

        {requestId && (
          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 text-left">
            <p className="text-xs text-gray-500">
              SELL REQUEST ID
            </p>

            <p className="font-medium text-gray-900 mt-1 break-all">
              {requestId}
            </p>
          </div>
        )}

        {reason === "verification_failed" && (
          <div className="mt-4 rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-left">
            <p className="text-sm font-medium text-yellow-900">
              Money deducted?
            </p>

            <p className="text-sm text-yellow-800 mt-1">
              If money was deducted from your account, do not make repeated
              payments immediately. The payment may still be processing.
              Check your payment status or contact support.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {requestId && (
            <Link
              href={`/sell/payment?requestId=${encodeURIComponent(
                requestId,
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

function SellPaymentFailedLoading() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-200 p-8 text-center">
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-gray-700" />

        <h1 className="text-xl font-semibold text-gray-900 mt-5">
          Loading payment status...
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Please wait.
        </p>
      </div>
    </main>
  );
}

export default function SellPaymentFailedPage() {
  return (
    <Suspense fallback={<SellPaymentFailedLoading />}>
      <SellPaymentFailedContent />
    </Suspense>
  );
}
