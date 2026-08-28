"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

export default function SellPaymentSuccessPage() {
  const searchParams = useSearchParams();

  const sellRequestId =
    searchParams.get("sellRequestId");

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

        {sellRequestId && (
          <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-xs text-gray-500">
              SELL REQUEST ID
            </p>

            <p className="font-semibold text-gray-900 mt-1 break-all">
              {sellRequestId}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-start gap-3 text-left rounded-xl bg-blue-50 p-4">
          <PackageCheck className="w-5 h-5 text-blue-600 shrink-0" />

          <div>
            <p className="font-medium text-blue-900">
              What's next?
            </p>

            <p className="text-sm text-blue-800 mt-1">
              We'll continue processing your sell request and
              keep you updated about the next step.
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

          {sellRequestId && (
            <Link
              href={`/sell/orders/${sellRequestId}`}
              className="py-3 px-4 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2"
            >
              Track Request
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}