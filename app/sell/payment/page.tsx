"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
  WalletCards,
} from "lucide-react";

import {
  createSellPaymentOrder,
  verifySellPayment,
  type SellPaymentMethod,
  type VerifySellPaymentPayload,
} from "@/app/lib/api";

type SellPaymentData = {
  sellRequestId: string;
  sellPaymentId: string;
  razorpayOrderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  keyId: string;
  method: SellPaymentMethod;
};

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

 function SellPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestId = searchParams.get("requestId");

  const [paymentMethod, setPaymentMethod] = useState<SellPaymentMethod>("UPI");

  const [paymentData, setPaymentData] = useState<SellPaymentData | null>(null);

  const [loading, setLoading] = useState(true);
  const [creatingPayment, setCreatingPayment] = useState(false);
  const [error, setError] = useState("");

  const paymentStartedRef = useRef(false);

  /**
   * Load Razorpay checkout script once.
   */
  const loadRazorpay = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") {
      return false;
    }

    if (window.Razorpay) {
      return true;
    }

    return new Promise<boolean>((resolve) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true), {
          once: true,
        });

        existingScript.addEventListener("error", () => resolve(false), {
          once: true,
        });

        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  }, []);

  /**
   * Create/reuse backend Razorpay order.
   */
  const createPaymentOrder = useCallback(async () => {
    if (!requestId) {
      setError("Sell request ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await createSellPaymentOrder(requestId, paymentMethod);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to create payment order.");
      }

      setPaymentData(response.data);
    } catch (err) {
      console.error("SELL PAYMENT ORDER ERROR:", err);

      setError(
        getApiErrorMessage(err, "Unable to prepare payment. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  }, [requestId, paymentMethod]);

  /**
   * Create a new/reused payment order whenever
   * request ID or payment method changes.
   */
  useEffect(() => {
    if (!requestId) {
      setLoading(false);
      setError("Sell request ID is missing.");
      return;
    }

    void createPaymentOrder();
  }, [requestId, createPaymentOrder]);

  /**
   * Verify payment with backend.
   */
  const verifyPaymentResponse = async (response: RazorpayPaymentResponse) => {
    if (!requestId) {
      throw new Error("Sell request ID is missing.");
    }

    const payload: VerifySellPaymentPayload = {
      razorpayPaymentId: response.razorpay_payment_id,

      razorpayOrderId: response.razorpay_order_id,

      razorpaySignature: response.razorpay_signature,
    };

    const verificationResponse = await verifySellPayment(requestId, payload);

    if (!verificationResponse.success || !verificationResponse.data) {
      throw new Error(
        verificationResponse.message || "Payment verification failed.",
      );
    }

    return verificationResponse.data;
  };

  /**
   * Open Razorpay checkout.
   */
  const openRazorpayCheckout = async () => {
    if (!paymentData || !requestId) {
      return;
    }

    if (paymentStartedRef.current) {
      return;
    }

    paymentStartedRef.current = true;

    try {
      setCreatingPayment(true);
      setError("");

      const razorpayLoaded = await loadRazorpay();

      if (
        !razorpayLoaded ||
        typeof window === "undefined" ||
        !window.Razorpay
      ) {
        throw new Error(
          "Unable to load Razorpay. Please check your internet connection and try again.",
        );
      }

      const options: RazorpayOptions = {
        key: paymentData.keyId,

        amount: paymentData.amountInPaise,

        currency: paymentData.currency,

        name: "PhoneBhai",

        description: "Phone sale payment",
        order_id: paymentData.razorpayOrderId,

        theme: {
          color: "#111827",
        },

        handler: async (razorpayResponse: RazorpayPaymentResponse) => {
          try {
            setCreatingPayment(true);

            await verifyPaymentResponse(razorpayResponse);

            router.replace(
              `/sell/sell-payment-success?requestId=${encodeURIComponent(
                requestId,
              )}`,
            );
          } catch (err) {
            console.error("SELL PAYMENT VERIFICATION ERROR:", err);

            router.replace(
              `/sell/sell-payment-failed?requestId=${encodeURIComponent(
                requestId,
              )}&reason=verification_failed`,
            );
          } finally {
            setCreatingPayment(false);
            paymentStartedRef.current = false;
          }
        },

        modal: {
          ondismiss: () => {
            paymentStartedRef.current = false;
            setCreatingPayment(false);

            router.replace(
              `/sell/sell-payment-failed?requestId=${encodeURIComponent(
                requestId,
              )}&reason=cancelled`,
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", () => {
        paymentStartedRef.current = false;
        setCreatingPayment(false);

        router.replace(
          `/sell/sell-payment-failed?requestId=${encodeURIComponent(
            requestId,
          )}&reason=payment_failed`,
        );
      });

      razorpay.open();
    } catch (err) {
      console.error("SELL RAZORPAY ERROR:", err);

      paymentStartedRef.current = false;
      setCreatingPayment(false);

      setError(getErrorMessage(err));
    }
  };

  /**
   * Missing request ID.
   */
  if (!requestId && !loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <CreditCard className="h-7 w-7 text-red-600" />
          </div>

          <h1 className="text-xl font-semibold text-gray-900">
            Payment cannot be started
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Sell request ID is missing.
          </p>

          <button
            type="button"
            onClick={() => router.push("/sell")}
            className="mt-6 w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Sell
          </button>
        </div>
      </main>
    );
  }

  /**
   * Loading state.
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-700" />

          <p className="text-sm text-gray-600">Preparing secure payment...</p>
        </div>
      </main>
    );
  }

  /**
   * Payment order creation failed.
   */
  if (error && !paymentData) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <CreditCard className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              Unable to prepare payment
            </h1>

            <p className="mt-2 text-sm text-gray-600">{error}</p>

            <button
              type="button"
              onClick={() => void createPaymentOrder()}
              className="mt-6 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Secure Payment
                  </h1>

                  <p className="text-sm text-gray-500">
                    Complete your sell request pickup booking
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Smartphone className="h-5 w-5 text-gray-700" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Phone sale payment
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Complete the payment for your phone sale. The minimum
                    payment is ₹500.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Payment method
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  disabled={creatingPayment}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    paymentMethod === "UPI"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <WalletCards className="h-5 w-5" />

                  <div>
                    <p className="font-medium text-gray-900">UPI</p>

                    <p className="text-xs text-gray-500">
                      Google Pay, PhonePe, Paytm
                    </p>
                  </div>

                  {paymentMethod === "UPI" && (
                    <CheckCircle2 className="ml-auto h-5 w-5 text-gray-900" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  disabled={creatingPayment}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    paymentMethod === "CARD"
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />

                  <div>
                    <p className="font-medium text-gray-900">Card</p>

                    <p className="text-xs text-gray-500">
                      Credit or debit card
                    </p>
                  </div>

                  {paymentMethod === "CARD" && (
                    <CheckCircle2 className="ml-auto h-5 w-5 text-gray-900" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => void openRazorpayCheckout()}
              disabled={creatingPayment || !paymentData}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingPayment ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay ₹{paymentData?.amount?.toLocaleString("en-IN") ?? "0"}
                </>
              )}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4" />
              Secured by Razorpay
            </div>
          </section>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Pickup booking fee</span>

                <span className="font-medium text-gray-900">
                  ₹{paymentData?.amount?.toLocaleString("en-IN") ?? "0"}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>

                  <span className="text-xl font-bold text-gray-900">
                    ₹{paymentData?.amount?.toLocaleString("en-IN") ?? "0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-600">
              Your payment is processed securely through Razorpay. PhoneBhai
              does not store your card or UPI credentials.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
function SellPaymentLoading() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-gray-700" />

        <p className="text-sm text-gray-600">
          Preparing secure payment...
        </p>
      </div>
    </main>
  );
}
export default function SellPaymentPage() {
  return (
    <Suspense fallback={<SellPaymentLoading />}>
      <SellPaymentContent />
    </Suspense>
  );
}