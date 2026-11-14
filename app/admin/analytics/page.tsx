"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Eye,
  Users,
  ShoppingBag,
  CreditCard,
  Clock3,
} from "lucide-react";

import {
  getAdminAnalytics,
  type AnalyticsOverview,
} from "../lib/admin-api";

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminAnalytics(days);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load analytics");
      }

      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analytics failed");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  const metrics = [
    {
      label: "Page views",
      value: data?.pageViews ?? 0,
      icon: Eye,
    },
    {
      label: "Unique visitors",
      value: data?.uniqueVisitors ?? 0,
      icon: Users,
    },
    {
      label: "Orders",
      value: data?.orders ?? 0,
      icon: ShoppingBag,
    },
    {
      label: "New customers",
      value: data?.newCustomers ?? 0,
      icon: Users,
    },
    {
      label: "Successful payment volume",
      value: money(data?.successfulPaymentVolume ?? 0),
      icon: CreditCard,
    },
    {
      label: "Average active time / page",
      value: `${data?.averageSessionPageSeconds ?? 0}s`,
      icon: Clock3,
    },
  ];

  const maxViews = Math.max(
    1,
    ...(data?.popularPages.map((page) => page.views) ?? [1]),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Store performance
          </p>
          <h1 className="mt-2 text-3xl font-black text-gray-950">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Website traffic, customer activity and payment performance.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>

          <button
            onClick={() => void load()}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white p-3 disabled:opacity-50"
            aria-label="Refresh analytics"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-gray-200 bg-white p-16">
          <Loader2 className="animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-gray-500">
                      {metric.label}
                    </p>
                    <Icon size={20} className="text-gray-400" />
                  </div>
                  <p className="mt-5 text-2xl font-black text-gray-950">
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div>

          <section className="rounded-2xl border border-gray-200 bg-white p-6">
            <div>
              <h2 className="text-lg font-black text-gray-950">
                Most visited pages
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Page visits and average active time during the selected period.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {data?.popularPages.map((page) => (
                <div key={page.path}>
                  <div className="flex flex-wrap justify-between gap-2 text-sm">
                    <span className="break-all font-semibold text-gray-800">
                      {page.path}
                    </span>
                    <span className="font-bold text-gray-950">
                      {page.views.toLocaleString("en-IN")} views
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{
                        width: `${(page.views / maxViews) * 100}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    Average active time: {page.averageSeconds}s
                  </p>
                </div>
              ))}

              {!data?.popularPages.length && (
                <p className="py-8 text-center text-sm text-gray-400">
                  No website visit data has been recorded for this period.
                </p>
              )}
            </div>
          </section>

          <p className="text-xs leading-5 text-gray-400">
            Traffic metrics depend on the website analytics tracker being
            active. Payment volume includes payment records with PAID or
            PARTIALLY_PAID status, as returned by the backend.
          </p>
        </>
      )}
    </div>
  );
}