"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  RefreshCw,
  Smartphone,
} from "lucide-react";

import { getSellRequest, type SellRequestDetailsResponse } from "@/app/lib/api";

type TimelineStep = {
  status: string;
  title: string;
  description: string;
};

const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: "SUBMITTED",
    title: "Request submitted",
    description: "Your phone selling request has been successfully submitted.",
  },
  {
    status: "UNDER_REVIEW",
    title: "Request under review",
    description: "Our team is reviewing your submitted phone details.",
  },
  {
    status: "INSPECTION_SCHEDULED",
    title: "Inspection scheduled",
    description: "Your phone inspection has been scheduled.",
  },
  {
    status: "INSPECTED",
    title: "Phone inspected",
    description: "Our team has completed the phone inspection.",
  },
  {
    status: "OFFERED",
    title: "Final offer available",
    description: "Your final phone valuation is ready.",
  },
  {
    status: "ACCEPTED",
    title: "Offer accepted",
    description: "Your final valuation has been accepted.",
  },
  {
    status: "PICKUP_SCHEDULED",
    title: "Pickup scheduled",
    description: "Your phone pickup has been scheduled.",
  },
  {
    status: "PICKED_UP",
    title: "Phone picked up",
    description: "Your phone has been collected and is being processed.",
  },
  {
    status: "COMPLETED",
    title: "Sale completed",
    description: "Your phone sale has been completed successfully.",
  },
];

function getStatusIndex(status: string) {
  const index = TIMELINE_STEPS.findIndex((step) => step.status === status);

  return index;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getStatusTitle(status: string) {
  switch (status) {
    case "SUBMITTED":
      return "Request submitted";

    case "UNDER_REVIEW":
      return "Under review";

    case "INSPECTION_SCHEDULED":
      return "Inspection scheduled";

    case "INSPECTED":
      return "Phone inspected";

    case "OFFERED":
      return "Final offer available";

    case "ACCEPTED":
      return "Offer accepted";

    case "PICKUP_SCHEDULED":
      return "Pickup scheduled";

    case "PICKED_UP":
      return "Phone picked up";

    case "COMPLETED":
      return "Sale completed";

    case "CANCELLED":
      return "Request cancelled";

    case "REJECTED":
      return "Request rejected";

    default:
      return "Request status";
  }
}

function SellRequestPageLoading() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-56 rounded bg-gray-200" />

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="h-32 rounded-xl bg-gray-200" />
              <div className="mt-6 h-8 w-64 rounded bg-gray-200" />
              <div className="mt-6 space-y-4">
                <div className="h-16 rounded bg-gray-100" />
                <div className="h-16 rounded bg-gray-100" />
                <div className="h-16 rounded bg-gray-100" />
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="mt-6 h-24 rounded bg-gray-100" />
              <div className="mt-4 h-24 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SellRequestTrackingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const requestId = typeof params?.id === "string" ? params.id : "";

  const [data, setData] = useState<SellRequestDetailsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRequest = useCallback(
    async (showRefreshLoader = false) => {
      if (!requestId) {
        setLoading(false);
        setError("Sell request ID is missing.");
        return;
      }

      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await getSellRequest(requestId);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Unable to load sell request.");
        }

        setData(response.data);
      } catch (err) {
        console.error("GET SELL REQUEST ERROR:", err);

        setError(
          err instanceof Error ? err.message : "Unable to load sell request.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [requestId],
  );

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  const currentStatus = data?.status ?? "";

  const currentStatusIndex = useMemo(
    () => getStatusIndex(currentStatus),
    [currentStatus],
  );

  const isTerminalError =
    currentStatus === "CANCELLED" || currentStatus === "REJECTED";

  if (loading) {
    return <SellRequestPageLoading />;
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load sell request
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              {error || "The sell request could not be found."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  void loadRequest();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <Link
                href="/sell"
                className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900"
              >
                Back to Sell
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.push("/sell")}
            className="flex w-fit items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sell
          </button>

          <button
            type="button"
            disabled={refreshing}
            onClick={() => {
              void loadRequest(true);
            }}
            className="flex w-fit items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh status
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                  {data.product.images?.[0]?.url ? (
                    <img
                      src={data.product.images[0].url}
                      alt={data.product.images[0].altText || data.product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Smartphone className="h-10 w-10 text-gray-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500">
                    Sell Request
                  </p>

                  <h1 className="mt-1 text-2xl font-bold text-gray-900">
                    {data.product.brand} {data.product.name}
                  </h1>

                  <p className="mt-2 break-all text-xs text-gray-500">
                    Request ID: {data.id}
                  </p>
                </div>

                <div
                  className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                    isTerminalError
                      ? "bg-red-50 text-red-700"
                      : currentStatus === "COMPLETED"
                        ? "bg-green-50 text-green-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {getStatusTitle(currentStatus)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Sell progress
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Track your phone sale from submission to completion.
                  </p>
                </div>
              </div>

              {isTerminalError ? (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="font-semibold text-red-900">
                    {getStatusTitle(currentStatus)}
                  </p>

                  <p className="mt-1 text-sm text-red-800">
                    This sell request is no longer active. Please contact
                    support if you need assistance.
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  {TIMELINE_STEPS.map((step, index) => {
                    const completed =
                      currentStatusIndex >= 0 && index <= currentStatusIndex;

                    const active = index === currentStatusIndex;

                    return (
                      <div
                        key={step.status}
                        className="relative flex gap-4 pb-8 last:pb-0"
                      >
                        {index < TIMELINE_STEPS.length - 1 && (
                          <div
                            className={`absolute left-[15px] top-8 h-full w-px ${
                              currentStatusIndex > index
                                ? "bg-gray-900"
                                : "bg-gray-200"
                            }`}
                          />
                        )}

                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            completed
                              ? "bg-gray-900 text-white"
                              : "border-2 border-gray-300 bg-white text-gray-400"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <h3
                              className={`font-semibold ${
                                active
                                  ? "text-gray-900"
                                  : completed
                                    ? "text-gray-800"
                                    : "text-gray-400"
                              }`}
                            >
                              {step.title}
                            </h3>

                            {active && (
                              <span className="w-fit rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                Current
                              </span>
                            )}
                          </div>

                          <p
                            className={`mt-1 text-sm ${
                              completed ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-lg font-bold text-gray-900">
                Device details
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <DetailCard
                  label="Working status"
                  value={data.conditions.workingStatus}
                />

                <DetailCard
                  label="Screen condition"
                  value={data.conditions.screenCondition}
                />

                <DetailCard
                  label="Device condition"
                  value={data.conditions.deviceCondition}
                />

                <DetailCard
                  label="Battery condition"
                  value={data.conditions.batteryCondition}
                />
              </div>
            </div>

            {data.media.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-lg font-bold text-gray-900">
                  Submitted device media
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {data.media.map((media) => {
                    const isVideo = media.mimeType.startsWith("video/");

                    return (
                      <div
                        key={media.id}
                        className="aspect-square overflow-hidden rounded-xl bg-gray-100"
                      >
                        {isVideo ? (
                          <video
                            src={media.url}
                            controls
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <img
                            src={media.url}
                            alt="Submitted phone"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Valuation</h2>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Estimated value</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(data.valuation.estimatedValue)}
                </p>
              </div>

              {data.valuation.finalValue !== null ? (
                <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-sm text-green-700">Final offer</p>

                  <p className="mt-1 text-2xl font-bold text-green-900">
                    {formatCurrency(data.valuation.finalValue)}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-xs leading-5 text-gray-500">
                  Your final valuation will be updated here after inspection.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Pickup details
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={<MapPin className="h-5 w-5" />}
                  label="Address"
                  value={data.pickup.address}
                />

                <InfoRow
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Pickup date"
                  value={formatDate(data.pickup.date)}
                />

                <InfoRow
                  icon={<Clock3 className="h-5 w-5" />}
                  label="Pickup slot"
                  value={data.pickup.slot}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                  <CreditCard className="h-5 w-5 text-gray-700" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">Payment</h2>

                  <p className="text-xs text-gray-500">
                    Pickup booking payment
                  </p>
                </div>
              </div>

              {data.payment ? (
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Amount</span>

                    <span className="font-semibold text-gray-900">
                      {formatCurrency(
                        data.payment.amount,
                        data.payment.currency,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Method</span>

                    <span className="font-medium text-gray-900">
                      {data.payment.method}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        data.payment.status === "PAID"
                          ? "bg-green-50 text-green-700"
                          : data.payment.status === "FAILED"
                            ? "bg-red-50 text-red-700"
                            : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {data.payment.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500">Paid on</p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDateTime(data.payment.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  No payment record is available yet.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-700" />

                <div>
                  <h2 className="font-semibold text-gray-900">
                    What happens next?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    We will keep your sell request updated here as it moves
                    through inspection, valuation, pickup and completion.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-gray-500">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium leading-6 text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}
