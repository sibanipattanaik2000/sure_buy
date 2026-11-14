"use client";

import { useState } from "react";
import {
  Loader2,
  Search,
  UserRound,
  ShoppingBag,
  CreditCard,
  Smartphone,
} from "lucide-react";

import { searchAdminRecords } from "../lib/admin-api";

type SearchResults = {
  customers: Array<{
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number | string;
    createdAt: string;
    user: {
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      phone: string | null;
    };
    items: Array<{
      id: string;
      productName: string;
      imei: string | null;
      quantity: number;
    }>;
    payments: Array<{
      id: string;
      providerPaymentId: string | null;
      amount: number | string;
      status: string;
    }>;
  }>;
};

const money = (value: number | string) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function AdminSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();

    const value = query.trim();

    if (value.length < 2) {
      setError("Enter at least 2 characters to search.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await searchAdminRecords(value);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Search failed");
      }

      setResults(response.data as SearchResults);
    } catch (err) {
      setResults(null);
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Find store records
        </p>
        <h1 className="mt-2 text-3xl font-black text-gray-950">
          Global Search
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Search customers, orders, payment references and device IMEIs.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Search className="shrink-0 text-gray-400" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter order number, name, email, phone, payment ID or IMEI..."
            className="w-full bg-transparent py-2 text-sm outline-none text-sm text-black placeholder:text-gray-400 caret-black"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : (
            <Search size={17} />
          )}
          Search records
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center rounded-2xl bg-white p-14">
          <Loader2 className="animate-spin text-gray-500" />
        </div>
      )}

      {!loading && searched && results && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                  Matching customers
                </p>
                <UserRound className="text-gray-400" />
              </div>
              <p className="mt-4 text-3xl font-black">
                {results.customers.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                  Matching orders
                </p>
                <ShoppingBag className="text-gray-400" />
              </div>
              <p className="mt-4 text-3xl font-black">
                {results.orders.length}
              </p>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-black text-gray-950">Customers</h2>
            </div>

            {results.customers.length ? (
              <div className="divide-y divide-gray-100">
                {results.customers.map((customer) => (
                  <div key={customer.id} className="p-5">
                    <p className="font-bold text-gray-950">
                      {`${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() ||
                        "Customer"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {customer.email || "No email"} ·{" "}
                      {customer.phone || "No phone"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Customer ID: {customer.id}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-6 text-sm text-gray-400">
                No matching customers.
              </p>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="font-black text-gray-950">Orders and devices</h2>
            </div>

            {results.orders.length ? (
              <div className="divide-y divide-gray-100">
                {results.orders.map((order) => {
                  const customerName =
                    `${order.user.firstName ?? ""} ${order.user.lastName ?? ""}`.trim() ||
                    "Customer";

                  return (
                    <article key={order.id} className="space-y-4 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-gray-950">
                            {order.orderNumber}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {customerName} · {order.user.phone || order.user.email}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-black">
                            {money(order.totalAmount)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {order.status} · {order.paymentStatus}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-3 text-sm"
                          >
                            <span className="font-semibold text-gray-700">
                              <Smartphone
                                size={15}
                                className="mr-2 inline"
                              />
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="text-xs text-gray-500">
                              IMEI: {item.imei || "Not assigned"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {!!order.payments.length && (
                        <div className="space-y-2">
                          {order.payments.map((payment) => (
                            <div
                              key={payment.id}
                              className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500"
                            >
                              <span className="break-all">
                                <CreditCard
                                  size={14}
                                  className="mr-1 inline"
                                />
                                {payment.providerPaymentId || "No provider payment ID"}
                              </span>
                              <span>
                                {money(payment.amount)} · {payment.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="p-6 text-sm text-gray-400">
                No matching orders.
              </p>
            )}
          </section>

          {!results.customers.length && !results.orders.length && (
            <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              No matching records found.
            </p>
          )}
        </>
      )}
    </div>
  );
}