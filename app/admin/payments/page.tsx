"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  CreditCard,
  ReceiptText,
} from "lucide-react";

import { getAdminPayments } from "../lib/admin-api";

type PaymentRecord = {
  id: string;
  provider: string;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  amount: number | string;
  currency: string;
  status: string;
  method: string;
  referenceNote?: string | null;
  createdAt: string;
  refunds?: Array<{
    id: string;
    amount: number | string;
    status: string;
    reason?: string | null;
    providerRefundId?: string | null;
    createdAt: string;
  }>;
  order: {
    id: string;
    orderNumber: string;
    totalAmount: number | string;
    paymentStatus: string;
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
      phone: string | null;
    };
  };
};

const money = (value: number | string) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Status({ value }: { value: string }) {
  const normalized = value.toUpperCase();
  const positive = ["PAID", "PARTIALLY_PAID", "PROCESSED", "REFUNDED"].includes(
    normalized,
  );
  const negative = ["FAILED", "REJECTED"].includes(normalized);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-black ${
        positive
          ? "bg-green-50 text-green-700"
          : negative
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      {value}
    </span>
  );
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminPayments(search);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load payments");
      }

      setPayments(response.data as PaymentRecord[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment loading failed");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    void loadPayments();
  }, [loadPayments]);

  const totalAmount = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Transactions
          </p>
          <h1 className="mt-2 text-3xl font-black text-gray-950">
            Payments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review payment records, payment references and refunds.
          </p>
        </div>

        <button
          onClick={() => void loadPayments()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">
              Records returned
            </p>
            <ReceiptText className="text-gray-400" />
          </div>
          <p className="mt-4 text-3xl font-black">{payments.length}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-500">
              Amount in returned records
            </p>
            <CreditCard className="text-gray-400" />
          </div>
          <p className="mt-4 text-3xl font-black">
            {money(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            This is not a net revenue calculation.
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void loadPayments();
        }}
        className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3"
      >
        <Search className="mt-2 shrink-0 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search payment ID, order number, customer email or phone..."
          className="w-full bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white"
        >
          Search
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-black text-gray-950">Payment history</h2>
          <p className="mt-1 text-xs text-gray-400">
            Latest 100 matching payment records from the backend.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="animate-spin text-gray-500" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-14 text-center text-sm text-gray-500">
            No payment records found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {payments.map((payment) => {
              const customerName =
                `${payment.order.user.firstName ?? ""} ${payment.order.user.lastName ?? ""}`.trim() ||
                "Customer";

              return (
                <article key={payment.id} className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-gray-950">
                        {payment.order.orderNumber}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {payment.order.user.email || payment.order.user.phone}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black text-gray-950">
                        {money(payment.amount)}
                      </p>
                      <Status value={payment.status} />
                    </div>
                  </div>

                  <div className="grid gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs text-gray-400">Provider</p>
                      <p className="mt-1 font-bold">{payment.provider}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Method</p>
                      <p className="mt-1 font-bold">{payment.method}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Payment ID</p>
                      <p className="mt-1 break-all font-semibold">
                        {payment.providerPaymentId || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="mt-1 font-semibold">
                        {new Date(payment.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {payment.referenceNote && (
                    <p className="text-xs text-gray-500">
                      Reference: {payment.referenceNote}
                    </p>
                  )}

                  {!!payment.refunds?.length && (
                    <div className="rounded-xl border border-amber-100 p-4">
                      <p className="mb-3 text-xs font-black uppercase tracking-wide text-gray-500">
                        Refund records
                      </p>

                      <div className="space-y-3">
                        {payment.refunds.map((refund) => (
                          <div
                            key={refund.id}
                            className="flex flex-wrap items-center justify-between gap-3 text-sm"
                          >
                            <div>
                              <p className="font-bold text-gray-800">
                                {money(refund.amount)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {refund.reason || "No reason provided"}
                              </p>
                            </div>
                            <Status value={refund.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}