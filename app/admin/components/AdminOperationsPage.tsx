"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Search,
  Truck,
  MapPin,
  PackageCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAdminOrders,
  createAdminShiprocketShipment,
  assignAdminShiprocketAwb,
  scheduleAdminShiprocketPickup,
  generateAdminShiprocketManifest,
  type AdminOrder,
} from "../orders/admin-order-api";

type PageMode = "shiprocket" | "tracking" | "delivery";

const money = (value: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Status({ value }: { value: string | null | undefined }) {
  const status = value || "NOT UPDATED";

  return (
    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-black text-gray-700">
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default function AdminOperationsPage({
  mode,
}: {
  mode: PageMode;
}) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

      setOrders(response.data.orders);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  async function runShiprocketAction(
    order: AdminOrder,
    action: "create" | "awb" | "pickup" | "manifest",
  ) {
    if (actionId) return;

    const labels = {
      create: "create a Shiprocket shipment",
      awb: "assign an AWB",
      pickup: "request a pickup",
      manifest: "generate a manifest",
    };

    if (
      !window.confirm(
        `Are you sure you want to ${labels[action]} for ${order.orderNumber}?`,
      )
    ) {
      return;
    }

    setActionId(`${order.id}:${action}`);
    setError("");
    setSuccess("");

    try {
      if (action === "create") {
        const response = await createAdminShiprocketShipment(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Shipment creation failed");
        }

        setSuccess(`Shipment created for ${order.orderNumber}.`);
      }

      if (action === "awb") {
        const response = await assignAdminShiprocketAwb(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "AWB assignment failed");
        }

        setSuccess(
          response.data.alreadyAssigned
            ? "An AWB is already assigned to this shipment."
            : `AWB assigned: ${response.data.awbCode || "Assigned"}`,
        );
      }

      if (action === "pickup") {
        const response = await scheduleAdminShiprocketPickup(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Pickup request failed");
        }

        setSuccess(
          response.data.alreadyScheduled
            ? "Pickup was already requested."
            : "Pickup request submitted successfully.",
        );
      }

      if (action === "manifest") {
        const response = await generateAdminShiprocketManifest(order.id);

        if (!response.success || !response.data) {
          throw new Error(response.message || "Manifest generation failed");
        }

        const url = response.data.manifest_url;

        if (url && /^https?:\/\//i.test(url)) {
          setManifestLinks((current) => ({
            ...current,
            [order.id]: url,
          }));
          setSuccess("Manifest generated successfully.");
        } else {
          setSuccess(
            "Manifest request completed. Check your Shiprocket dashboard for the manifest.",
          );
        }
      }

      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Shiprocket operation failed",
      );
    } finally {
      setActionId("");
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "ALL") return true;

    if (mode === "delivery") {
      return order.status === statusFilter;
    }

    if (mode === "tracking") {
      if (statusFilter === "TRACKED") return !!order.shiprocket.awbCode;
      if (statusFilter === "NOT_TRACKED") return !order.shiprocket.awbCode;
    }

    if (mode === "shiprocket") {
      if (statusFilter === "CREATED") return !!order.shiprocket.shipmentId;
      if (statusFilter === "NOT_CREATED") return !order.shiprocket.shipmentId;
      if (statusFilter === "AWB_ASSIGNED") return !!order.shiprocket.awbCode;
    }

    return true;
  });

  const config = {
    shiprocket: {
      eyebrow: "Shipping operations",
      title: "Shiprocket",
      description:
        "Create shipments, assign AWBs, request pickups and generate manifests.",
    },
    tracking: {
      eyebrow: "Shipment visibility",
      title: "Order Tracking",
      description:
        "View AWB numbers, courier partners, tracking links and shipment updates.",
    },
    delivery: {
      eyebrow: "Fulfilment management",
      title: "Delivery",
      description:
        "Review delivery addresses, order fulfilment statuses and outstanding COD balances.",
    },
  }[mode];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            {config.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-black text-gray-950">
            {config.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {config.description}
          </p>
        </div>

        <button
          onClick={() => void loadOrders()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold disabled:opacity-50 text-gray-600"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
          <Search size={18} className="shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search order number, customer, phone or email..."
            className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 text-black caret-black"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-gray-400 bg-white px-3 py-2 text-sm font-semibold text-gray-500"
        >
          <option value="ALL">All Records</option>

          {mode === "shiprocket" && (
            <>
              <option value="CREATED">Shipment created</option>
              <option value="NOT_CREATED">Shipment not created</option>
              <option value="AWB_ASSIGNED">AWB assigned</option>
            </>
          )}

          {mode === "tracking" && (
            <>
              <option value="TRACKED">AWB available</option>
              <option value="NOT_TRACKED">AWB not assigned</option>
            </>
          )}

          {mode === "delivery" && (
            <>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="OUT_FOR_DELIVERY">Out for delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </>
          )}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center rounded-2xl border border-gray-200 bg-white p-16">
          <Loader2 className="animate-spin text-gray-500" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-14 text-center text-sm text-gray-500">
          No matching records found on this page.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const ship = order.shiprocket;
            const busy = actionId.startsWith(`${order.id}:`);
            const uncertain = [
              "CREATION_UNCERTAIN",
              "AWB_ASSIGNMENT_UNCERTAIN",
              "PICKUP_REQUEST_UNCERTAIN",
            ].includes(ship.status || "");

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-gray-950">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.customer.phone} · {order.customer.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Status value={order.status} />
                    <Status value={ship.status} />
                  </div>
                </div>

                {mode === "shiprocket" && (
                  <>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Metric label="Shipment ID" value={ship.shipmentId || "—"} />
                      <Metric label="AWB" value={ship.awbCode || "Not assigned"} />
                      <Metric label="Courier" value={ship.courierName || "—"} />
                      <Metric label="COD balance" value={money(order.remainingAmount)} />
                    </div>

                    {uncertain && (
                      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                        This operation has an uncertain result. Verify the
                        shipment in Shiprocket before attempting another
                        operation. Do not retry blindly.
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {!ship.shipmentId &&
                        !uncertain &&
                        ["CONFIRMED", "PROCESSING"].includes(order.status) && (
                          <ActionButton
                            disabled={!!actionId}
                            loading={actionId === `${order.id}:create`}
                            onClick={() =>
                              void runShiprocketAction(order, "create")
                            }
                          >
                            Create shipment
                          </ActionButton>
                        )}

                      {ship.shipmentId &&
                        !ship.awbCode &&
                        !uncertain && (
                          <ActionButton
                            disabled={!!actionId}
                            loading={actionId === `${order.id}:awb`}
                            onClick={() =>
                              void runShiprocketAction(order, "awb")
                            }
                          >
                            Assign AWB
                          </ActionButton>
                        )}

                      {ship.awbCode &&
                        !ship.pickupScheduledAt &&
                        !uncertain && (
                          <ActionButton
                            disabled={!!actionId}
                            loading={actionId === `${order.id}:pickup`}
                            onClick={() =>
                              void runShiprocketAction(order, "pickup")
                            }
                          >
                            Request pickup
                          </ActionButton>
                        )}

                      {ship.awbCode &&
                        (ship.pickupScheduledAt ||
                          ship.status === "PICKUP REQUESTED" ||
                          ship.status === "PICKUP SCHEDULED") && (
                          <ActionButton
                            disabled={!!actionId}
                            loading={actionId === `${order.id}:manifest`}
                            onClick={() =>
                              void runShiprocketAction(order, "manifest")
                            }
                          >
                            Generate manifest
                          </ActionButton>
                        )}

                      {manifestLinks[order.id] && (
                        <a
                          href={manifestLinks[order.id]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700"
                        >
                          Open manifest <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </>
                )}

                {mode === "tracking" && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Metric label="AWB number" value={ship.awbCode || "Not assigned"} />
                    <Metric label="Courier partner" value={ship.courierName || "Not assigned"} />
                    <Metric label="Shipment status" value={ship.status || "Not updated"} />
                    <Metric
                      label="Last update"
                      value={
                        ship.lastEventAt
                          ? new Date(ship.lastEventAt).toLocaleString("en-IN")
                          : "Not available"
                      }
                    />

                    {ship.trackingUrl &&
                      /^https?:\/\//i.test(ship.trackingUrl) && (
                        <a
                          href={ship.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white sm:col-span-2 lg:col-span-4"
                        >
                          Track shipment <ExternalLink size={15} />
                        </a>
                      )}
                  </div>
                )}

                {mode === "delivery" && (
                  <>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Metric label="Order status" value={order.status} />
                      <Metric label="Payment status" value={order.paymentStatus} />
                      <Metric label="Payment method" value={order.paymentMethod} />
                      <Metric label="COD outstanding" value={money(order.remainingAmount)} />
                    </div>

                    <div className="mt-5 rounded-xl bg-gray-50 p-4">
                      <p className="flex items-center gap-2 text-sm font-black text-gray-900">
                        <MapPin size={16} />
                        Delivery address
                      </p>
                      <p className="mt-3 text-sm font-semibold text-gray-800">
                        {order.shippingAddress.fullName} · {order.shippingAddress.phone}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2
                          ? `, ${order.shippingAddress.addressLine2}`
                          : ""}
                        , {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} -{" "}
                        {order.shippingAddress.postalCode},{" "}
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                  <span>
                    Order placed:{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </span>
                  <span>Total: {money(order.totalAmount)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
        <p className="text-xs text-gray-500">
          Page {page} of {totalPages}
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
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-gray-50 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-gray-900">
        {value}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  loading,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}