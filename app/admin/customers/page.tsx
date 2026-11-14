"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  Users,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";

import {
  getAdminCustomers,
  type AdminCustomer,
} from "../lib/admin-api";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminCustomers({
        page,
        limit: 20,
        search,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load customers");
      }

      setCustomers(response.data.customers);
      setTotal(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load customers",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Customer management
          </p>
          <h1 className="mt-2 text-3xl font-black text-gray-950">
            Customers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View registered customers and their order activity.
          </p>
        </div>

        <button
          onClick={() => void loadCustomers()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">
              Registered customers
            </p>
            <Users className="text-gray-400" />
          </div>
          <p className="mt-4 text-3xl font-black text-gray-950">
            {total.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">
              Customers on this page
            </p>
            <ShoppingBag className="text-gray-400" />
          </div>
          <p className="mt-4 text-3xl font-black text-gray-950">
            {customers.length}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search name, email, phone or customer ID..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-black text-gray-950">Customer directory</h2>
          <span className="text-xs font-semibold text-gray-400">
            Page {page} of {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-14 text-center text-sm text-gray-500">
            No customers found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {customers.map((customer) => {
              const fullName =
                `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() ||
                "Customer";

              return (
                <div
                  key={customer.id}
                  className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 font-black text-gray-700">
                      {fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-950">
                        {fullName}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Mail size={13} />
                        {customer.email || "No email provided"}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Phone size={13} />
                        {customer.phone || "No phone provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                    <div>
                      <p className="text-xs text-gray-400">Orders</p>
                      <p className="mt-1 font-black text-gray-950">
                        {customer.totalOrders}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Joined</p>
                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {new Date(customer.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <p className="max-w-28 truncate text-[10px] text-gray-400">
                      ID: {customer.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500">
            {total.toLocaleString("en-IN")} customers total
          </p>

          <div className="flex gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-lg border border-gray-200 p-2 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={page >= totalPages || loading}
              onClick={() =>
                setPage((value) => Math.min(totalPages, value + 1))
              }
              className="rounded-lg border border-gray-200 p-2 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}