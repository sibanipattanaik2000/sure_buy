"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

type OrderStatus =
  | "Processing"
  | "Confirmed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

type Order = {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  image: string;
  storage: string;
  color: string;
  price: number;
  paymentMethod: string;
  orderDate: string;
  deliveryDate: string;
  status: OrderStatus;
};

const demoOrders: Order[] = [
  {
    id: "SB-58951374",
    productId: "1",
    productName: "iPhone 15",
    brand: "Apple",
    image: "/images/iphone-15.png",
    storage: "128GB",
    color: "Black",
    price: 42999,
    paymentMethod: "UPI",
    orderDate: "18 Aug 2026",
    deliveryDate: "21–23 Aug 2026",
    status: "Confirmed",
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "All" | OrderStatus
  >("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("PhoneBhai-orders");

      if (savedOrders) {
        const parsedOrders: Order[] = JSON.parse(savedOrders);
        setOrders(parsedOrders);
      } else {
        /*
         * Demo data for now.
         *
         * Once your checkout starts saving orders,
         * this fallback can be removed.
         */
        setOrders(demoOrders);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders(demoOrders);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (activeFilter !== "All") {
      result = result.filter(
        (order) => order.status === activeFilter,
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.productName.toLowerCase().includes(query) ||
          order.brand.toLowerCase().includes(query),
      );
    }

    return result;
  }, [orders, activeFilter, search]);

  const orderCounts = {
    all: orders.length,
    processing: orders.filter(
      (order) =>
        order.status === "Processing" ||
        order.status === "Confirmed",
    ).length,
    shipped: orders.filter(
      (order) =>
        order.status === "Shipped" ||
        order.status === "Out for Delivery",
    ).length,
    delivered: orders.filter(
      (order) => order.status === "Delivered",
    ).length,
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
     {/* HERO */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Your account
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                View your purchases, track deliveries and manage
                your orders from one place.
              </p>
            </div>

            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-600"
            >
              Continue shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* SUMMARY */}

      <section className="mx-auto max-w-7xl px-5 pt-7 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<ShoppingBag size={19} />}
            label="Total orders"
            value={orderCounts.all}
          />

          <SummaryCard
            icon={<Clock3 size={19} />}
            label="Active orders"
            value={orderCounts.processing}
          />

          <SummaryCard
            icon={<Truck size={19} />}
            label="In transit"
            value={orderCounts.shipped}
          />

          <SummaryCard
            icon={<CheckCircle2 size={19} />}
            label="Delivered"
            value={orderCounts.delivered}
          />
        </div>
      </section>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* SEARCH */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by order ID or product..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* FILTERS */}

          <div className="flex gap-2 overflow-x-auto pb-1">
            <FilterButton
              active={activeFilter === "All"}
              onClick={() => setActiveFilter("All")}
            >
              All
            </FilterButton>

            <FilterButton
              active={activeFilter === "Confirmed"}
              onClick={() => setActiveFilter("Confirmed")}
            >
              Active
            </FilterButton>

            <FilterButton
              active={
                activeFilter === "Shipped" ||
                activeFilter === "Out for Delivery"
              }
              onClick={() => setActiveFilter("Shipped")}
            >
              Shipped
            </FilterButton>

            <FilterButton
              active={activeFilter === "Delivered"}
              onClick={() => setActiveFilter("Delivered")}
            >
              Delivered
            </FilterButton>

            <FilterButton
              active={activeFilter === "Cancelled"}
              onClick={() => setActiveFilter("Cancelled")}
            >
              Cancelled
            </FilterButton>
          </div>
        </div>

        {/* ORDERS */}

        <div className="mt-7">
          {loading ? (
            <OrdersSkeleton />
          ) : filteredOrders.length === 0 ? (
            <EmptyOrders
              search={search}
              onClear={() => {
                setSearch("");
                setActiveFilter("All");
              }}
            />
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ORDER CARD */

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* TOP */}

      <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Order ID
            </p>

            <p className="mt-1 text-sm font-black text-gray-950">
              {order.id}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Ordered on
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {order.orderDate}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Payment
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              {order.paymentMethod}
            </p>
          </div>
        </div>

        <StatusBadge status={order.status} />
      </div>

      {/* PRODUCT */}

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row">
          <div className="flex h-32 w-28 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-4 sm:h-36 sm:w-32">
            <img
              src={order.image}
              alt={order.productName}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {order.brand}
            </p>

            <h2 className="mt-1 text-lg font-black text-gray-950">
              {order.productName}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                {order.storage}
              </span>

              <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600">
                {order.color}
              </span>
            </div>

            <div className="mt-auto pt-4">
              <p className="text-xs text-gray-400">
                Total amount
              </p>

              <p className="mt-0.5 text-xl font-black text-gray-950">
                ₹{order.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* DELIVERY */}

          <div className="sm:w-52">
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Truck
                  size={17}
                  className="text-indigo-600"
                />

                <p className="text-xs font-bold">
                  {order.status === "Delivered"
                    ? "Delivered"
                    : "Estimated delivery"}
                </p>
              </div>

              <p className="mt-2 text-sm font-black text-gray-900">
                {order.deliveryDate}
              </p>

              {order.status !== "Delivered" &&
                order.status !== "Cancelled" && (
                  <p className="mt-1 text-[11px] leading-5 text-gray-500">
                    We’ll notify you when your order moves
                    to the next stage.
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
            <ShieldCheck size={15} />
            PhoneBhai quality checked
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {order.status !== "Cancelled" && (
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                View order
                <ChevronRight size={15} />
              </Link>
            )}

            {order.status !== "Delivered" &&
              order.status !== "Cancelled" && (
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                >
                  Track order
                  <Truck size={15} />
                </Link>
              )}

            {order.status === "Delivered" && (
              <Link
                href={`/buy/${order.productId}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600"
              >
                Buy again
                <ShoppingBag size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* SUMMARY CARD */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <span className="text-2xl font-black text-gray-950">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold text-gray-500">
        {label}
      </p>
    </div>
  );
}

/* FILTER BUTTON */

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
        active
          ? "bg-black text-white"
          : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

/* STATUS */

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<
    OrderStatus,
    {
      icon: React.ReactNode;
      className: string;
    }
  > = {
    Processing: {
      icon: <Clock3 size={13} />,
      className: "bg-amber-50 text-amber-700",
    },

    Confirmed: {
      icon: <CheckCircle2 size={13} />,
      className: "bg-green-50 text-green-700",
    },

    Shipped: {
      icon: <Package size={13} />,
      className: "bg-indigo-50 text-indigo-700",
    },

    "Out for Delivery": {
      icon: <Truck size={13} />,
      className: "bg-purple-50 text-purple-700",
    },

    Delivered: {
      icon: <CheckCircle2 size={13} />,
      className: "bg-green-50 text-green-700",
    },

    Cancelled: {
      icon: <X size={13} />,
      className: "bg-red-50 text-red-700",
    },
  };

  const current = config[status];

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${current.className}`}
    >
      {current.icon}
      {status}
    </span>
  );
}

/* EMPTY */

function EmptyOrders({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        {search ? (
          <Search size={27} />
        ) : (
          <ShoppingBag size={27} />
        )}
      </div>

      <h2 className="mt-6 text-xl font-black text-gray-950">
        {search
          ? "No matching orders"
          : "You haven't placed any orders yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {search
          ? "Try searching with another order ID, product name or brand."
          : "Explore our quality-checked devices and find your next phone."}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {search && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700"
          >
            Clear search
          </button>
        )}

        <Link
          href="/buy"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Explore phones
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

/* SKELETON */

function OrdersSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse overflow-hidden rounded-3xl border border-gray-200 bg-white"
        >
          <div className="h-20 border-b border-gray-100 bg-gray-50" />

          <div className="flex gap-5 p-6">
            <div className="h-32 w-28 rounded-2xl bg-gray-200" />

            <div className="flex-1">
              <div className="h-3 w-20 rounded bg-gray-200" />
              <div className="mt-3 h-5 w-48 rounded bg-gray-200" />
              <div className="mt-4 h-7 w-28 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}