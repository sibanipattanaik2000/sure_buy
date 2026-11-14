
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  RefreshCw,
  Search,
  Wallet,
  ReceiptText,
  PackageCheck,
  ExternalLink,
  Truck,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  RotateCcw,
  UserRound,
  Package,
  IndianRupee,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

import {
  getAdminOrders,
  recordAdminCashCollection,
  confirmAdminCashRefund,
  reconcileAdminRazorpayRefund,
  retryAdminRazorpayRefund,
  createAdminShiprocketShipment,
  assignAdminShiprocketAwb,
  scheduleAdminShiprocketPickup,
  generateAdminShiprocketManifest,
  type AdminOrder,
} from "./admin-order-api";

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusStyle = (status: string) => {
  const value = status.toUpperCase();

  if (
    ["DELIVERED", "PAID", "SUCCESS", "COMPLETED", "REFUNDED"].includes(value)
  ) {
    return "bg-gray-950 text-white";
  }

  if (
    ["CANCELLED", "FAILED", "REJECTED"].includes(value)
  ) {
    return "bg-gray-200 text-gray-700";
  }

  if (
    ["REFUND_PENDING", "REQUESTED", "PROCESSING", "PENDING"].includes(value)
  ) {
    return "bg-gray-100 text-gray-800 border border-gray-400";
  }

  return "bg-white text-gray-800 border border-gray-400";
};

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

  const [shiprocketActionId, setShiprocketActionId] = useState<string | null>(
    null,
  );

  const [manifestLinks, setManifestLinks] = useState<Record<string, string>>(
    {},
  );

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
      setError(err instanceof Error ? err.message : "Unable to load orders");
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
      const response = await recordAdminCashCollection(selectedOrder.id, {
        amount,
        referenceNote: referenceNote.trim(),
        idempotencyKey: crypto.randomUUID(),
      });

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
        err instanceof Error ? err.message : "Unable to record cash collection",
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
        const response = await reconcileAdminRazorpayRefund(order.id, refundId);

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
      setError(err instanceof Error ? err.message : "Refund action failed");
    } finally {
      setRefundActionId(null);
    }
  };

  const handleShiprocketAction = async (
    order: AdminOrder,
    action: "create" | "awb" | "pickup" | "manifest",
  ) => {
    if (shiprocketActionId) return;

    const labels = {
      create: "create the shipment",
      awb: "assign the AWB",
      pickup: "schedule the pickup",
      manifest: "generate the manifest",
    };

    if (
      !window.confirm(
        `Are you sure you want to ${labels[action]} for ${order.orderNumber}?`,
      )
    ) {
      return;
    }

    setShiprocketActionId(`${order.id}:${action}`);
    setError("");
    setSuccess("");

    try {
      if (action === "create") {
        const response = await createAdminShiprocketShipment(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Shipment creation failed.");
        }

        setSuccess("Shiprocket shipment created.");
      } else if (action === "awb") {
        const response = await assignAdminShiprocketAwb(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "AWB assignment failed.");
        }

        setSuccess(
          response.data.alreadyAssigned
            ? "AWB is already assigned."
            : `AWB assigned: ${response.data.awbCode ?? ""}`,
        );
      } else if (action === "pickup") {
        const response = await scheduleAdminShiprocketPickup(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Pickup scheduling failed.");
        }

        setSuccess(
          response.data.alreadyScheduled
            ? "Pickup was already requested."
            : "Pickup request submitted.",
        );
      } else {
        const response = await generateAdminShiprocketManifest(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Manifest generation failed.");
        }

        const url = response.data.manifest_url;

        if (url && /^https?:\/\//i.test(url)) {
          setManifestLinks((current) => ({
            ...current,
            [order.id]: url,
          }));
        }

        setSuccess(
          url
            ? "Manifest generated successfully."
            : "Manifest request completed. Check your Shiprocket dashboard.",
        );
      }

      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Shiprocket operation failed.",
      );
    } finally {
      setShiprocketActionId(null);
    }
  };

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-gray-950" size={30} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-3 py-6 text-gray-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              <Package size={14} />
              Admin / Orders
            </div>

            <h1 className="text-2xl font-black tracking-tight text-black sm:text-3xl">
              Order Management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
              Manage customer orders, payment history, outstanding balances,
              refunds and Shiprocket deliveries.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh orders
          </button>
        </div>

        {/* NOTIFICATIONS */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-400 bg-white p-4 text-sm text-gray-900 shadow-sm">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <p className="flex-1 leading-6">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="text-gray-500 hover:text-black"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-gray-400 bg-gray-200 p-4 text-sm text-gray-950">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <p className="flex-1 leading-6">{success}</p>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success"
              className="text-gray-500 hover:text-black"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* SEARCH */}

        <div className="mt-7 rounded-2xl border border-gray-400 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-3">
            <Search size={20} className="shrink-0 text-gray-500" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search order number, customer, phone or email..."
              className="w-full bg-transparent py-2 text-sm font-medium text-gray-950 outline-none placeholder:text-gray-500"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* ORDER LIST */}

        <div className="mt-6 space-y-5">
          {loading ? (
            <div className="rounded-2xl border border-gray-400 bg-white px-5 py-16 text-center shadow-sm">
              <Loader2 className="mx-auto animate-spin text-black" size={30} />
              <p className="mt-4 text-sm font-semibold text-gray-600">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-gray-400 bg-white px-5 py-16 text-center shadow-sm">
              <Package className="mx-auto text-gray-500" size={34} />
              <h3 className="mt-4 text-base font-black">No orders found</h3>
              <p className="mt-1 text-sm text-gray-600">
                Try another search term or refresh the order list.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <section
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-400 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* ORDER HEADER */}

                <div className="border-b border-gray-400 bg-white p-4 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-black px-3 py-1.5 text-sm font-black text-white">
                          {order.orderNumber}
                        </span>

                        <span className="text-xs font-medium text-gray-500">
                          Order ID: {order.id}
                        </span>
                      </div>

                      <div className="mt-4 flex items-start gap-3">
                        <div className="rounded-xl bg-gray-100 p-3">
                          <UserRound size={20} className="text-gray-700" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-gray-950">
                            {order.customer.firstName}{" "}
                            {order.customer.lastName}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {order.customer.phone}
                          </p>
                          <p className="break-all text-xs text-gray-500">
                            {order.customer.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 xl:max-w-md xl:justify-end">
                      <span
                        className={`rounded-lg px-3 py-2 text-xs font-bold ${statusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>

                      <span
                        className={`rounded-lg px-3 py-2 text-xs font-bold ${statusStyle(order.paymentStatus)}`}
                      >
                        {order.paymentStatus}
                      </span>

                      <span className="rounded-lg border border-gray-400 bg-gray-100 px-3 py-2 text-xs font-bold text-gray-800">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-4 sm:p-6">
                  {/* ORDER METRICS */}

                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Metric
                      label="Order total"
                      value={money(order.totalAmount)}
                      icon={<IndianRupee size={17} />}
                    />
                    <Metric
                      label="Collected"
                      value={money(order.paidAmount)}
                      icon={<Wallet size={17} />}
                    />
                    <Metric
                      label="Remaining"
                      value={money(order.remainingAmount)}
                      icon={<CreditCard size={17} />}
                    />
                    <Metric
                      label="Total items"
                      value={String(order.items.length)}
                      icon={<Package size={17} />}
                    />
                  </div>

                  {/* ITEMS */}

                  <div>
                    <SectionHeading
                      icon={<Package size={17} />}
                      title="Order items"
                      subtitle={`${order.items.length} item(s) in this order`}
                    />

                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-400">
                      {order.items.map((item, index) => (
                        <div
                          key={item.id}
                          className={`flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center ${
                            index !== 0 ? "border-t border-gray-400" : ""
                          }`}
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-950">
                              {item.productName}
                            </p>
                            <p className="mt-1 text-xs font-medium text-gray-600">
                              {item.storage ? `${item.storage} · ` : ""}
                              Quantity: {item.quantity}
                            </p>
                          </div>

                          <p className="text-sm font-black text-gray-950">
                            {money(item.subtotal)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SHIPROCKET */}

                  <div className="rounded-2xl border border-gray-400 bg-gray-100 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <SectionHeading
                        icon={<Truck size={18} />}
                        title="Shiprocket delivery"
                        subtitle="Shipment, AWB, pickup and tracking"
                      />

                      <span className="rounded-lg border border-gray-400 bg-white px-3 py-2 text-xs font-bold text-gray-900">
                        {order.shiprocket.status || "Not created"}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                      <Metric
                        label="Shipment ID"
                        value={order.shiprocket.shipmentId || "—"}
                        compact
                      />
                      <Metric
                        label="AWB number"
                        value={order.shiprocket.awbCode || "Not assigned"}
                        compact
                      />
                      <Metric
                        label="Courier"
                        value={order.shiprocket.courierName || "—"}
                        compact
                      />
                      <Metric
                        label="Shiprocket order"
                        value={order.shiprocket.orderId || "—"}
                        compact
                      />
                    </div>

                    {order.paymentMethod === "COD" && (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-400 bg-white p-3">
                        <span className="text-xs font-semibold text-gray-600">
                          Outstanding COD amount
                        </span>
                        <strong className="text-sm text-black">
                          {money(order.remainingAmount)}
                        </strong>
                      </div>
                    )}

                    {[
                      "CREATION_UNCERTAIN",
                      "AWB_ASSIGNMENT_UNCERTAIN",
                      "PICKUP_REQUEST_UNCERTAIN",
                    ].includes(order.shiprocket.status || "") && (
                      <div className="mt-4 flex items-start gap-2 rounded-xl border border-gray-500 bg-white p-3 text-xs leading-5 text-gray-800">
                        <AlertCircle size={17} className="mt-0.5 shrink-0" />
                        <p>
                          This request has an uncertain result. Verify it in
                          Shiprocket before attempting another operation. Do
                          not retry blindly.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {!order.shiprocket.shipmentId &&
                        !["CREATING", "CREATION_UNCERTAIN"].includes(
                          order.shiprocket.status || "",
                        ) && (
                          <ActionButton
                            disabled={!!shiprocketActionId}
                            onClick={() =>
                              void handleShiprocketAction(order, "create")
                            }
                          >
                            <Truck size={14} />
                            Create shipment
                          </ActionButton>
                        )}

                      {order.shiprocket.shipmentId &&
                        !order.shiprocket.awbCode &&
                        ![
                          "AWB_ASSIGNING",
                          "AWB_ASSIGNMENT_UNCERTAIN",
                        ].includes(order.shiprocket.status || "") && (
                          <ActionButton
                            disabled={!!shiprocketActionId}
                            onClick={() =>
                              void handleShiprocketAction(order, "awb")
                            }
                          >
                            Assign AWB
                          </ActionButton>
                        )}

                      {order.shiprocket.awbCode &&
                        !order.shiprocket.pickupScheduledAt &&
                        ![
                          "PICKUP_REQUESTING",
                          "PICKUP_REQUEST_UNCERTAIN",
                          "PICKUP REQUESTED",
                          "PICKUP SCHEDULED",
                        ].includes(order.shiprocket.status || "") && (
                          <ActionButton
                            disabled={!!shiprocketActionId}
                            onClick={() =>
                              void handleShiprocketAction(order, "pickup")
                            }
                          >
                            Schedule pickup
                          </ActionButton>
                        )}

                      {order.shiprocket.awbCode &&
                        (Boolean(order.shiprocket.pickupScheduledAt) ||
                          ["PICKUP REQUESTED", "PICKUP SCHEDULED"].includes(
                            order.shiprocket.status || "",
                          )) && (
                          <ActionButton
                            variant="outline"
                            disabled={!!shiprocketActionId}
                            onClick={() =>
                              void handleShiprocketAction(order, "manifest")
                            }
                          >
                            <PackageCheck size={14} />
                            Generate manifest
                          </ActionButton>
                        )}

                      {order.shiprocket.trackingUrl &&
                        /^https?:\/\//i.test(order.shiprocket.trackingUrl) && (
                          <a
                            href={order.shiprocket.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-500 bg-white px-3 py-2.5 text-xs font-bold text-gray-900 transition hover:bg-gray-200"
                          >
                            <ExternalLink size={14} />
                            Track shipment
                          </a>
                        )}

                      {manifestLinks[order.id] && (
                        <a
                          href={manifestLinks[order.id]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-500 bg-white px-3 py-2.5 text-xs font-bold text-gray-900 transition hover:bg-gray-200"
                        >
                          <PackageCheck size={14} />
                          Open manifest
                        </a>
                      )}
                    </div>
                  </div>

                  {/* PAYMENT HISTORY */}

                  <div>
                    <SectionHeading
                      icon={<ReceiptText size={18} />}
                      title="Payment history"
                      subtitle={`${order.payments.length} payment record(s)`}
                    />

                    {order.payments.length === 0 ? (
                      <div className="mt-3 rounded-xl border border-gray-400 bg-gray-100 p-5 text-center text-sm text-gray-600">
                        No payment records available.
                      </div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {order.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="overflow-hidden rounded-xl border border-gray-400"
                          >
                            <div className="flex flex-col justify-between gap-3 bg-gray-100 p-4 sm:flex-row sm:items-center">
                              <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-white p-2.5 text-gray-800">
                                  <CreditCard size={18} />
                                </div>

                                <div>
                                  <p className="text-sm font-black text-gray-950">
                                    {payment.provider} · {payment.method}
                                  </p>

                                  <p className="mt-1 text-xs font-semibold text-gray-600">
                                    {payment.status}
                                  </p>

                                  {payment.referenceNote && (
                                    <p className="mt-1 text-xs text-gray-600">
                                      {payment.referenceNote}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <p className="text-lg font-black text-black">
                                {money(payment.amount)}
                              </p>
                            </div>

                            {/* REFUNDS */}

                            {payment.refunds?.map((refund) => (
                              <div
                                key={refund.id}
                                className="border-t border-gray-400 bg-white p-4"
                              >
                                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <RotateCcw
                                        size={15}
                                        className="text-gray-600"
                                      />
                                      <p className="text-sm font-black text-gray-950">
                                        Refund · {refund.status}
                                      </p>
                                    </div>

                                    <p className="mt-2 text-xs text-gray-600">
                                      {refund.reason || "Refund request"}
                                    </p>

                                    {refund.providerRefundId && (
                                      <p className="mt-1 break-all text-xs text-gray-500">
                                        Razorpay ID: {refund.providerRefundId}
                                      </p>
                                    )}
                                  </div>

                                  <p className="text-sm font-black text-gray-950">
                                    {money(refund.amount)}
                                  </p>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {payment.provider === "CASH" &&
                                    refund.status === "MANUAL_PENDING" && (
                                      <ActionButton
                                        disabled={!!refundActionId}
                                        onClick={() =>
                                          void handleRefundAction(
                                            order,
                                            refund.id,
                                            "confirm-cash",
                                          )
                                        }
                                      >
                                        {refundActionId === refund.id ? (
                                          <Loader2
                                            size={14}
                                            className="animate-spin"
                                          />
                                        ) : (
                                          <CheckCircle2 size={14} />
                                        )}
                                        Confirm cash returned
                                      </ActionButton>
                                    )}

                                  {payment.provider === "RAZORPAY" &&
                                    refund.status === "REQUESTED" && (
                                      <ActionButton
                                        variant="outline"
                                        disabled={!!refundActionId}
                                        onClick={() =>
                                          void handleRefundAction(
                                            order,
                                            refund.id,
                                            "reconcile",
                                          )
                                        }
                                      >
                                        {refundActionId === refund.id ? (
                                          <Loader2
                                            size={14}
                                            className="animate-spin"
                                          />
                                        ) : (
                                          <RefreshCw size={14} />
                                        )}
                                        Reconcile with Razorpay
                                      </ActionButton>
                                    )}

                                  {payment.provider === "RAZORPAY" &&
                                    refund.status === "FAILED" && (
                                      <ActionButton
                                        disabled={!!refundActionId}
                                        onClick={() =>
                                          void handleRefundAction(
                                            order,
                                            refund.id,
                                            "retry",
                                          )
                                        }
                                      >
                                        {refundActionId === refund.id ? (
                                          <Loader2
                                            size={14}
                                            className="animate-spin"
                                          />
                                        ) : (
                                          <RotateCcw size={14} />
                                        )}
                                        Retry failed refund
                                      </ActionButton>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CASH COLLECTION */}

                  {order.paymentMethod === "COD" &&
                    order.remainingAmount > 0 &&
                    order.status !== "CANCELLED" &&
                    order.paymentStatus !== "REFUND_PENDING" &&
                    order.paymentStatus !== "REFUNDED" && (
                      <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-400 bg-gray-100 p-4 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-sm font-black text-gray-950">
                            Outstanding cash collection
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            Record the amount actually received from the
                            customer.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openCollection(order)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
                        >
                          <Wallet size={17} />
                          Record cash collection
                        </button>
                      </div>
                    )}
                </div>
              </section>
            ))
          )}
        </div>

        {/* PAGINATION */}

        <div className="mt-7 flex flex-col justify-between gap-4 rounded-2xl border border-gray-400 bg-white p-4 sm:flex-row sm:items-center">
          <p className="text-sm font-semibold text-gray-600">
            Page <span className="font-black text-black">{page}</span> of{" "}
            <span className="font-black text-black">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-400 bg-white px-4 py-2.5 text-sm font-bold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* CASH COLLECTION MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-5">
          <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-400 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-400 bg-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-black p-3 text-white">
                  <ReceiptText size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-black">
                    Record cash received
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-gray-600">
                    {selectedOrder.orderNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                disabled={!!savingOrderId}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-200 hover:text-black disabled:opacity-40"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="rounded-xl border border-gray-400 bg-gray-100 p-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Order total</span>
                  <strong className="text-gray-950">
                    {money(selectedOrder.totalAmount)}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between gap-3">
                  <span className="text-gray-600">Already collected</span>
                  <strong className="text-gray-950">
                    {money(selectedOrder.paidAmount)}
                  </strong>
                </div>

                <div className="mt-3 flex justify-between gap-3 border-t border-gray-400 pt-3">
                  <span className="font-bold text-gray-800">Remaining</span>
                  <strong className="text-base font-black text-black">
                    {money(selectedOrder.remainingAmount)}
                  </strong>
                </div>
              </div>

              <label className="mt-5 block text-sm font-bold text-gray-900">
                Cash amount received
                <div className="mt-2 flex items-center rounded-xl border border-gray-400 bg-white px-4 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                  <IndianRupee size={17} className="text-gray-500" />
                  <input
                    type="number"
                    min="0.01"
                    max={selectedOrder.remainingAmount}
                    step="0.01"
                    value={cashAmount}
                    onChange={(event) => setCashAmount(event.target.value)}
                    className="w-full bg-transparent px-2 py-3.5 text-sm font-bold text-black outline-none"
                    placeholder="Enter amount"
                  />
                </div>
              </label>

              <label className="mt-4 block text-sm font-bold text-gray-900">
                Receipt / reference note
                <span className="ml-1 font-medium text-gray-500">
                  (Optional)
                </span>
                <input
                  value={referenceNote}
                  maxLength={250}
                  onChange={(event) => setReferenceNote(event.target.value)}
                  placeholder="e.g. Cash received at delivery"
                  className="mt-2 w-full rounded-xl border border-gray-400 bg-white px-4 py-3.5 text-sm text-black outline-none placeholder:text-gray-500 focus:border-black focus:ring-1 focus:ring-black"
                />
              </label>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-gray-400 bg-gray-100 p-3 text-xs leading-5 text-gray-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p>
                  Only record money that has actually been received. The
                  server checks the latest outstanding balance before saving.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  disabled={!!savingOrderId}
                  className="flex-1 rounded-xl border border-gray-400 bg-white px-4 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void submitCollection()}
                  disabled={!!savingOrderId}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingOrderId ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Wallet size={16} />
                  )}
                  {savingOrderId ? "Saving..." : "Save collection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SectionHeading({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-lg bg-gray-200 p-2 text-gray-800">{icon}</div>
      <div>
        <h3 className="text-sm font-black text-gray-950">{title}</h3>
        <p className="mt-0.5 text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  compact = false,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-gray-400 bg-white ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex items-center gap-2 text-gray-600">
        {icon}
        <p className="text-xs font-semibold">{label}</p>
      </div>

      <p
        className={`mt-2 break-words font-black text-gray-950 ${
          compact ? "text-sm" : "text-base sm:text-lg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "solid",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === "solid"
          ? "bg-black text-white hover:bg-gray-800"
          : "border border-gray-500 bg-white text-gray-900 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
