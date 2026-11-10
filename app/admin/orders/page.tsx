"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  RefreshCw,
  Search,
  Wallet,
  ReceiptText,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

import {
  getAdminOrders,
  recordAdminCashCollection,
  confirmAdminCashRefund,
  reconcileAdminRazorpayRefund,
  retryAdminRazorpayRefund,
  type AdminOrder,
} from "./admin-order-api";

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [refundActionId, setRefundActionId] = useState<string | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [cashAmount, setCashAmount] = useState("");
  const [referenceNote, setReferenceNote] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminOrders({
        page,
        limit: 20,
        search,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Unable to load orders");
      }

      setOrders(response.data.orders ?? []);
      setTotalPages(response.data.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load orders",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    if (!authLoading && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      void loadOrders();
    }
  }, [authLoading, user, loadOrders]);

  const openCollection = (order: AdminOrder) => {
    setSelectedOrder(order);
    setCashAmount(String(order.remainingAmount));
    setReferenceNote("");
    setError("");
    setSuccess("");
  };

  const submitCollection = async () => {
    if (!selectedOrder || savingOrderId) return;

    const amount = Number(cashAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid cash amount.");
      return;
    }

    if (amount > selectedOrder.remainingAmount) {
      setError("Cash amount cannot exceed the remaining balance.");
      return;
    }

    setSavingOrderId(selectedOrder.id);
    setError("");
    setSuccess("");

    try {
      const response = await recordAdminCashCollection(
        selectedOrder.id,
        {
          amount,
          referenceNote: referenceNote.trim(),
          idempotencyKey: crypto.randomUUID(),
        },
      );

      if (!response.success) {
        throw new Error(response.message || "Unable to record collection");
      }

      setSuccess(
        `${money(amount)} cash collection recorded for ${selectedOrder.orderNumber}.`,
      );

      setSelectedOrder(null);
      setCashAmount("");
      setReferenceNote("");

      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to record cash collection",
      );
    } finally {
      setSavingOrderId(null);
    }
  };

  const handleRefundAction = async (
    order: AdminOrder,
    refundId: string,
    action: "confirm-cash" | "reconcile" | "retry",
  ) => {
    if (refundActionId) return;

    if (
      action === "confirm-cash" &&
      !window.confirm(
        "Confirm that this cash refund has actually been returned to the customer?",
      )
    ) {
      return;
    }

    setRefundActionId(refundId);
    setError("");
    setSuccess("");

    try {
      if (action === "confirm-cash") {
        const response = await confirmAdminCashRefund(order.id, refundId);

        if (!response.success) {
          throw new Error(response.message || "Unable to confirm cash refund");
        }

        setSuccess("Cash refund confirmation saved.");
      }

      if (action === "reconcile") {
        const response = await reconcileAdminRazorpayRefund(
          order.id,
          refundId,
        );

        if (!response.success) {
          throw new Error(response.message || "Unable to reconcile refund");
        }

        if (response.data?.status === "UNRESOLVED") {
          setError(
            response.data.message ||
              "Refund was not matched. Check Razorpay before retrying.",
          );
        } else {
          setSuccess(
            `Razorpay refund status: ${response.data?.status ?? "updated"}.`,
          );
        }
      }

      if (action === "retry") {
        const response = await retryAdminRazorpayRefund(
          order.id,
          refundId,
          crypto.randomUUID(),
        );

        if (!response.success) {
          throw new Error(response.message || "Unable to retry refund");
        }

        setSuccess("Refund retry submitted.");
      }

      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Refund action failed",
      );
    } finally {
      setRefundActionId(null);
    }
  };

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-950">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review orders, payments, outstanding balances and COD collections.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mt-6 flex gap-2 rounded-2xl border border-gray-200 bg-white p-3">
          <Search className="mt-2 text-gray-400" size={18} />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search order number, customer, phone or email..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="rounded-2xl bg-white p-12 text-center">
              <Loader2 className="mx-auto animate-spin text-indigo-600" />
              <p className="mt-3 text-sm text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center text-sm text-gray-500">
              No orders found.
            </div>
          ) : (
            orders.map((order) => (
              <section
                key={order.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div>
                    <p className="font-black text-gray-950">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {order.customer.firstName} {order.customer.lastName}
                      {" · "}
                      {order.customer.phone}
                    </p>

                    <p className="text-xs text-gray-400">
                      {order.customer.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-bold">
                    <span className="rounded-full bg-gray-100 px-3 py-2">
                      {order.status}
                    </span>

                    <span className="rounded-full bg-indigo-50 px-3 py-2 text-indigo-700">
                      {order.paymentStatus}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-2">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Metric label="Order total" value={money(order.totalAmount)} />
                  <Metric label="Collected" value={money(order.paidAmount)} />
                  <Metric label="Remaining" value={money(order.remainingAmount)} />
                  <Metric label="Items" value={String(order.items.length)} />
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                    Items
                  </p>

                  <div className="mt-2 space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4 text-sm"
                      >
                        <span className="text-gray-700">
                          {item.productName}
                          {item.storage ? ` · ${item.storage}` : ""}
                          {" × "}
                          {item.quantity}
                        </span>

                        <span className="font-semibold">
                          {money(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-xs font-black uppercase tracking-wide text-gray-400">
                    Payment history
                  </p>

                  {order.payments.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500">
                      No payment records.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-3">
                      {order.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="rounded-xl border border-gray-100 p-3"
                        >
                          {/* PAYMENT DETAILS */}

                          <div className="flex flex-wrap justify-between gap-2 rounded-xl bg-gray-50 p-3 text-sm">
                            <div>
                              <p className="font-bold text-gray-800">
                                {payment.provider} · {payment.method}
                              </p>

                              <p className="text-xs text-gray-500">
                                {payment.status}
                                {payment.referenceNote
                                  ? ` · ${payment.referenceNote}`
                                  : ""}
                              </p>
                            </div>

                            <p className="font-bold">
                              {money(payment.amount)}
                            </p>
                          </div>

                          {/* REFUNDS BELONG TO THIS PAYMENT */}

                          {payment.refunds?.map((refund) => (
                            <div
                              key={refund.id}
                              className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3"
                            >
                              <div className="flex flex-wrap justify-between gap-2">
                                <div>
                                  <p className="text-xs font-black text-gray-800">
                                    Refund · {refund.status}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-600">
                                    {refund.reason || "Refund request"}
                                  </p>

                                  {refund.providerRefundId && (
                                    <p className="mt-1 break-all text-[11px] text-gray-500">
                                      Razorpay ID: {refund.providerRefundId}
                                    </p>
                                  )}
                                </div>

                                <p className="text-sm font-black">
                                  {money(refund.amount)}
                                </p>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {payment.provider === "CASH" &&
                                  refund.status === "MANUAL_PENDING" && (
                                    <button
                                      type="button"
                                      disabled={!!refundActionId}
                                      onClick={() =>
                                        void handleRefundAction(
                                          order,
                                          refund.id,
                                          "confirm-cash",
                                        )
                                      }
                                      className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                                    >
                                      {refundActionId === refund.id
                                        ? "Saving..."
                                        : "Confirm cash returned"}
                                    </button>
                                  )}

                                {payment.provider === "RAZORPAY" &&
                                  refund.status === "REQUESTED" && (
                                    <button
                                      type="button"
                                      disabled={!!refundActionId}
                                      onClick={() =>
                                        void handleRefundAction(
                                          order,
                                          refund.id,
                                          "reconcile",
                                        )
                                      }
                                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 disabled:opacity-50"
                                    >
                                      {refundActionId === refund.id
                                        ? "Checking..."
                                        : "Reconcile with Razorpay"}
                                    </button>
                                  )}

                                {payment.provider === "RAZORPAY" &&
                                  refund.status === "FAILED" && (
                                    <button
                                      type="button"
                                      disabled={!!refundActionId}
                                      onClick={() =>
                                        void handleRefundAction(
                                          order,
                                          refund.id,
                                          "retry",
                                        )
                                      }
                                      className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                                    >
                                      {refundActionId === refund.id
                                        ? "Submitting..."
                                        : "Retry confirmed failed refund"}
                                    </button>
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {order.paymentMethod === "COD" &&
                  order.remainingAmount > 0 &&
                  order.status !== "CANCELLED" &&
                  order.paymentStatus !== "REFUND_PENDING" &&
                  order.paymentStatus !== "REFUNDED" && (
                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => openCollection(order)}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                      >
                        <Wallet size={17} />
                        Record cash collection
                      </button>
                    </div>
                  )}
              </section>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* CASH COLLECTION MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <ReceiptText size={20} />
              </div>

              <div>
                <h2 className="font-black">Record cash received</h2>
                <p className="text-xs text-gray-500">
                  {selectedOrder.orderNumber}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order total</span>
                <strong>{money(selectedOrder.totalAmount)}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-gray-500">Already collected</span>
                <strong>{money(selectedOrder.paidAmount)}</strong>
              </div>

              <div className="mt-2 flex justify-between">
                <span className="text-gray-500">Remaining</span>
                <strong>{money(selectedOrder.remainingAmount)}</strong>
              </div>
            </div>

            <label className="mt-5 block text-sm font-bold">
              Cash amount received

              <input
                type="number"
                min="0.01"
                max={selectedOrder.remainingAmount}
                step="0.01"
                value={cashAmount}
                onChange={(event) => setCashAmount(event.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <label className="mt-4 block text-sm font-bold">
              Receipt / reference note (optional)

              <input
                value={referenceNote}
                maxLength={250}
                onChange={(event) => setReferenceNote(event.target.value)}
                placeholder="e.g. Cash received at delivery"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </label>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Only record money that has actually been received. The server
              checks the latest outstanding balance before saving.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                disabled={!!savingOrderId}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void submitCollection()}
                disabled={!!savingOrderId}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {savingOrderId ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Wallet size={16} />
                )}

                Save collection
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      <p className="mt-1 text-lg font-black text-gray-900">{value}</p>
    </div>
  );
}