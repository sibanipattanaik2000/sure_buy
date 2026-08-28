"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type SellRequest = {
  id: string;
  status: string;
  estimatedValue: string | number;
  finalValue: string | number | null;
  pickupAddress: string;
  pickupDate: string;
  pickupSlot: string;
  product?: {
    id: number;
    name: string;
    brand: string;
    images?: {
      url: string;
    }[];
  };
};

type PaymentResponse = {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    amount: string | number;
    currency: string;
    status: string;
    providerOrderId?: string | null;
    provider?: string;
    method?: string;
  };
};

export default function SellPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sellRequestId = searchParams.get("sellRequestId");

  const [sellRequest, setSellRequest] = useState<SellRequest | null>(null);
  const [payment, setPayment] = useState<PaymentResponse["data"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!sellRequestId) {
      setError("Sell request ID is missing.");
      setLoading(false);
      return;
    }

    loadSellRequest();
  }, [sellRequestId]);

  async function loadSellRequest() {
    if (!sellRequestId) return;

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push(
          `/login?redirect=/sell/payment?sellRequestId=${encodeURIComponent(
            sellRequestId
          )}`
        );
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/sell-requests/${sellRequestId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load sell request."
        );
      }

      setSellRequest(result.data);

      await loadExistingPayment(token);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load sell request."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadExistingPayment(token: string) {
    if (!sellRequestId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/sell-requests/${sellRequestId}/payment`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) return;

      const result: PaymentResponse = await response.json();

      if (result.success && result.data) {
        setPayment(result.data);
      }
    } catch {
      // Existing payment is optional.
      // Creation will handle the actual payment state.
    }
  }

  function getPayableAmount() {
    if (!sellRequest) return 0;

    /*
     * IMPORTANT:
     * This amount is display-only.
     * The backend remains the source of truth.
     */
    const value =
      sellRequest.finalValue ?? sellRequest.estimatedValue;

    return Number(value);
  }

  async function createPayment() {
    if (!sellRequestId) {
      setError("Sell request ID is missing.");
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      setError("Payment gateway is still loading. Please try again.");
      return;
    }

    try {
      setProcessing(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push(
          `/login?redirect=/sell/payment?sellRequestId=${encodeURIComponent(
            sellRequestId
          )}`
        );
        return;
      }

      /*
       * DO NOT send amount from frontend.
       * Backend determines the amount.
       */
      const response = await fetch(
        `${API_BASE_URL}/sell-requests/${sellRequestId}/payment/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            method: "UPI",
          }),
        }
      );

      const result: PaymentResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || "Unable to create payment."
        );
      }

      setPayment(result.data);

      const paymentData = result.data;

      if (!paymentData.providerOrderId) {
        throw new Error("Payment order was not created correctly.");
      }

      const razorpayKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay key is not configured."
        );
      }

      const options = {
        key: razorpayKey,

        amount: Math.round(
          Number(paymentData.amount) * 100
        ),

        currency: paymentData.currency || "INR",

        name: "SureBuy",

        description: `Sell Request ${sellRequestId}`,

        order_id: paymentData.providerOrderId,

        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          await verifyPayment(response);
        },

        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },

        theme: {
          color: "#111827",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          const reason =
            response?.error?.description ||
            "Payment failed.";

          setProcessing(false);

          router.push(
            `/sell-payment-failed?sellRequestId=${encodeURIComponent(
              sellRequestId
            )}&reason=${encodeURIComponent(reason)}`
          );
        }
      );

      razorpay.open();
    } catch (err) {
      setProcessing(false);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment."
      );
    }
  }

  async function verifyPayment(razorpayResponse: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) {
    if (!sellRequestId) return;

    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Authentication required.");
      }

      const response = await fetch(
        `${API_BASE_URL}/sell-requests/${sellRequestId}/payment/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            razorpayPaymentId:
              razorpayResponse.razorpay_payment_id,

            razorpayOrderId:
              razorpayResponse.razorpay_order_id,

            razorpaySignature:
              razorpayResponse.razorpay_signature,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Payment verification failed."
        );
      }

      router.replace(
        `/sell-payment-success?sellRequestId=${encodeURIComponent(
          sellRequestId
        )}`
      );
    } catch (err) {
      setProcessing(false);

      const message =
        err instanceof Error
          ? err.message
          : "Payment verification failed.";

      router.push(
        `/sell-payment-failed?sellRequestId=${encodeURIComponent(
          sellRequestId
        )}&reason=${encodeURIComponent(message)}`
      );
    }
  }

  const amount = getPayableAmount();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading payment details...
        </div>
      </main>
    );
  }

  if (error && !sellRequest) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />

          <h1 className="text-xl font-semibold text-gray-900">
            Unable to continue
          </h1>

          <p className="mt-2 text-gray-600">
            {error}
          </p>

          <Link
            href="/sell"
            className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-black text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sell
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() =>
          setError(
            "Unable to load Razorpay payment gateway."
          )
        }
      />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sell
          </Link>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            <section className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  SELL YOUR PHONE
                </p>

                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                  Complete Payment
                </h1>

                <p className="text-gray-600 mt-2">
                  Securely complete your payment through Razorpay.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  {sellRequest?.product?.images?.[0]?.url ? (
                    <img
                      src={sellRequest.product.images[0].url}
                      alt={sellRequest.product.name}
                      className="w-20 h-20 object-contain rounded-xl bg-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <h2 className="font-semibold text-lg">
                      {sellRequest?.product?.brand}{" "}
                      {sellRequest?.product?.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Sell Request: {sellRequest?.id}
                    </p>

                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 text-xs font-medium">
                      {sellRequest?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-lg mb-5">
                  Payment method
                </h2>

                <div className="border-2 border-gray-900 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">
                      Razorpay
                    </p>

                    <p className="text-sm text-gray-500">
                      UPI, Cards, Net Banking & more
                    </p>
                  </div>

                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />

                  <p className="text-sm">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex items-start gap-3 text-sm text-gray-500">
                <ShieldCheck className="w-5 h-5 shrink-0 text-green-600" />

                <p>
                  Your payment is processed securely through Razorpay.
                  Your card/UPI credentials are never stored by SureBuy.
                </p>
              </div>
            </section>

            <aside>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
                <h2 className="font-semibold text-xl">
                  Payment Summary
                </h2>

                <div className="border-t border-gray-200 mt-5 pt-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Sell value
                    </span>

                    <span className="font-medium">
                      ₹
                      {amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-semibold">
                      Amount
                    </span>

                    <span className="text-xl font-bold">
                      ₹
                      {amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={createPayment}
                  disabled={
                    processing ||
                    !razorpayLoaded ||
                    !sellRequestId
                  }
                  className="w-full mt-6 py-4 rounded-xl bg-black text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay ₹
                      {amount.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                {!razorpayLoaded && (
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Loading secure payment gateway...
                  </p>
                )}

                {payment?.status === "PAID" && (
                  <div className="mt-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
                    This payment has already been completed.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}