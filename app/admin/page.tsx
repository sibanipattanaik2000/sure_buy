"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  ShoppingBag,
  CreditCard,
  ArrowUpRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  getAdminAnalytics,
  type AnalyticsOverview,
} from "./lib/admin-api";

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminAnalytics(days);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load dashboard");
      }

      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Dashboard loading failed",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [days]);

  const cards = [
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
      label: "Payment volume",
      value: money(data?.successfulPaymentVolume ?? 0),
      icon: CreditCard,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            PhoneBhai Control Center
          </p>

          <h1 className="mt-2 text-3xl font-black text-gray-950">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your store, customers, orders and performance.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>

          <button
            onClick={() => void load()}
            className="rounded-xl border border-gray-200 bg-white p-3 text-gray-600"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center rounded-2xl bg-white p-16">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {card.label}
                    </span>
                    <Icon size={20} className="text-gray-400" />
                  </div>

                  <p className="mt-5 text-2xl font-black text-gray-950">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-black text-gray-900">Popular pages</h2>
              <p className="mt-1 text-sm text-gray-500">
                Pages receiving the most visits.
              </p>

              <div className="mt-5 space-y-4">
                {data?.popularPages.map((page) => (
                  <div key={page.path}>
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="truncate font-semibold">
                        {page.path}
                      </span>
                      <span className="font-bold">{page.views} views</span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{
                          width: `${
                            (page.views /
                              Math.max(
                                1,
                                data.popularPages[0]?.views ?? 1,
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      Average active time: {page.averageSeconds}s
                    </p>
                  </div>
                ))}

                {!data?.popularPages.length && (
                  <p className="text-sm text-gray-400">
                    No analytics data recorded yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-black text-gray-900">Quick management</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ["Manage orders", "/admin/orders"],
                  ["Manage products", "/admin/products"],
                  ["Shiprocket", "/admin/shiprocket"],
                  ["Tracking", "/admin/tracking"],
                  ["Payments", "/admin/payments"],
                  ["Find customer", "/admin/search"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between rounded-xl border border-gray-100 p-4 text-sm font-bold hover:bg-gray-50 text-gray-600 transition-colors duration-200"
                  >
                    {label}
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}