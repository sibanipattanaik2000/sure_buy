"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  PackageCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { getSellPaymentStatus } from "@/app/lib/api";

export default function SellPaymentSuccessPage() {
  const searchParams = useSearchParams();

  const requestId =
    searchParams.get("requestId") ||
    searchParams.get("sellRequestId");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

useEffect(() => {
  if (!requestId) {
    setLoading(false);
    setError("Sell request ID is missing.");
    return;
  }

  const currentRequestId = requestId;

  let cancelled = false;

  async function verifyStatus() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getSellPaymentStatus(currentRequestId);

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Unable to verify payment status.",
        );
      }

      if (cancelled) {
        return;
      }

      const paymentStatus =
        response.data.payment?.status?.toUpperCase();

      if (paymentStatus !== "PAID") {
        setVerified(false);
        setError(
          "Your payment could not be confirmed yet. Please check your payment status or try again.",
        );
        return;
      }

      setVerified(true);
    } catch (err) {
      if (cancelled) {
        return;
      }

      console.error(
        "SELL PAYMENT SUCCESS STATUS ERROR:",
        err,
      );

      setVerified(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify payment status.",
      );
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void verifyStatus();

  return () => {
    cancelled = true;
  };
}, [requestId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-200 p-8 text-center">
          <Loader2 className="w-10 h-10 mx-auto animate-spin text-gray-700" />

          <h1 className="text-xl font-semibold text-gray-900 mt-5">
            Verifying your payment
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Please wait while we confirm your payment securely.
          </p>
        </div>
      </main>
    );
  }

  if (!requestId || !verified) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-11 h-11 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-6">
            Payment Could Not Be Confirmed
          </h1>

          <p className="text-gray-600 mt-3">
            {error ||
              "We could not confirm the payment for this sell request."}
          </p>

          {requestId && (
            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4 text-left">
              <p className="text-xs text-gray-500">
                SELL REQUEST ID
              </p>

              <p className="font-medium text-gray-900 mt-1 break-all">
                {requestId}
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
                Try Again
              </Link>
            )}

            <Link
              href="/sell"
              className="py-3 px-4 rounded-xl border border-gray-300 font-medium hover:bg-gray-50"
            >
              Back to Sell
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-11 h-11 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mt-6">
          Payment Successful
        </h1>

        <p className="text-gray-600 mt-3">
          Your payment has been successfully verified.
          Your sell request is now being processed.
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
          <p className="text-xs text-gray-500">
            SELL REQUEST ID
          </p>

          <p className="font-semibold text-gray-900 mt-1 break-all">
            {requestId}
          </p>
        </div>

        <div className="mt-6 flex items-start gap-3 text-left rounded-xl bg-blue-50 p-4">
          <PackageCheck className="w-5 h-5 text-blue-600 shrink-0" />

          <div>
            <p className="font-medium text-blue-900">
              What's next?
            </p>

            <p className="text-sm text-blue-800 mt-1">
              Your pickup request is now scheduled. We'll continue
              processing your phone sale and keep you updated about
              the next step.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          <Link
            href="/sell"
            className="py-3 px-4 rounded-xl border border-gray-300 font-medium hover:bg-gray-50"
          >
            Sell Another Phone
          </Link>

          <Link
            href={`/sell/orders/${encodeURIComponent(requestId)}`}
            className="py-3 px-4 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2"
          >
            Track Request
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
