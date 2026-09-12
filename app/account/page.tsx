"use client";

import Link from "next/link";
import {
  UserRound,
  Heart,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Pencil,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";

type Profile = {
  fullName: string;
  phone: string;
  email: string;
};

type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  landmark?: string | null;
  isDefault: boolean;
};

type RecentOrderItem = {
  id: string;
  productName: string;
  brand: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  items: RecentOrderItem[];
};

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    phone: "",
    email: "",
  });

  const [address, setAddress] = useState<SavedAddress | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    setProfile({
      fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      phone: user.phone || "",
      email: user.email || "",
    });
  }, [user, loading, router]);

  // --------------------------------------------------
  // LOAD REAL ADDRESS + ORDERS
  // --------------------------------------------------

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    let mounted = true;

    const loadAccountData = async () => {
      try {
        setDataLoading(true);

        const [addressResponse, ordersResponse] = await Promise.all([
          apiRequest<SavedAddress[]>("/addresses"),
          apiRequest<RecentOrder[]>("/orders"),
        ]);

        if (!mounted) {
          return;
        }

        // --------------------------------------------
        // SAVED ADDRESS
        // Backend already returns default address first.
        // --------------------------------------------

        if (addressResponse?.success && Array.isArray(addressResponse.data)) {
          const addresses = addressResponse.data;

          const defaultAddress =
            addresses.find((item) => item.isDefault) ?? addresses[0] ?? null;

          setAddress(defaultAddress);
        } else {
          setAddress(null);
        }

        // --------------------------------------------
        // RECENT ORDERS
        // Backend already returns newest first.
        // --------------------------------------------

        if (ordersResponse?.success && Array.isArray(ordersResponse.data)) {
          setOrders(ordersResponse.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to load account data:", error);

        if (!mounted) {
          return;
        }

        setAddress(null);
        setOrders([]);
      } finally {
        if (mounted) {
          setDataLoading(false);
        }
      }
    };

    loadAccountData();

    return () => {
      mounted = false;
    };
  }, [user, loading]);

  const displayName = profile.fullName
    ? profile.fullName
        .trim()
        .split(/\s+/)
        .map(
          (name) =>
            name.charAt(0).toUpperCase() +
            name.slice(1).toLowerCase(),
        )
        .join(" ")
    : "Your Name";

  const displayPhone = profile.phone
    ? `+91 ${profile.phone}`
    : "Add your mobile number";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f6f7fb] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">

        {/* PAGE HEADER */}
        <div className="relative mb-8 overflow-hidden rounded-[28px] border border-indigo-100 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-purple-200/20 blur-3xl" />

          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
              <UserRound size={13} />
              My Account
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Welcome
              {profile.fullName
                ? `, ${displayName}`
                : " to PhoneBhai"}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Manage your profile, orders, wishlist and delivery details from
              one place
            </p>
          </div>
        </div>

        {/* PROFILE */}
        <section
          id="personal-information"
          className="group relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-md" />

                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-purple-100 text-indigo-600 ring-4 ring-white">
                  <UserRound size={28} strokeWidth={2.2} />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-black tracking-tight text-gray-950">
                  {displayName}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  {displayPhone}
                </p>

                {profile.email && (
                  <p className="mt-1 text-xs text-gray-400">
                    {profile.email}
                  </p>
                )}

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                  <ShieldCheck size={13} />
                  Account details saved
                </div>
              </div>
            </div>

            <Link
              href="/edit-profile"
              className="group/edit inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Pencil
                size={15}
                className="transition-transform group-hover/edit:rotate-[-8deg]"
              />
              Edit Profile
            </Link>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AccountCard
            href="/orders"
            icon={<Package size={21} />}
            title="My Orders"
            description="Track your purchases"
          />

          <AccountCard
            href="/wishlist"
            icon={<Heart size={21} />}
            title="Wishlist"
            description="Your saved phones"
          />

          <AccountCard
            href="/checkout"
            icon={<MapPin size={21} />}
            title="Saved Address"
            description="Manage your delivery details"
          />
        </div>

        {/* SAVED ADDRESS */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-gray-950">
                Saved Delivery Address
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest checkout address is saved here for convenience
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:border-indigo-100 hover:shadow-lg">

            {dataLoading ? (
              <div className="space-y-4 p-7">
                <div className="h-6 w-40 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-20 w-full animate-pulse rounded-2xl bg-gray-100" />
              </div>
            ) : address ? (
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 ring-1 ring-indigo-100">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-gray-950">
                        {address.fullName}
                      </h3>

                      {address.isDefault && (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {address.addressLine1}

                      {address.addressLine2 && (
                        <>
                          <br />
                          {address.addressLine2}
                        </>
                      )}

                      <br />
                      {address.city}, {address.state} -{" "}
                      {address.postalCode}
                    </p>

                    {address.landmark && (
                      <p className="mt-1 text-xs text-gray-500">
                        Landmark: {address.landmark}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-semibold text-gray-500">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  Use at checkout
                  <ChevronRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center overflow-hidden py-12 text-center">
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-100/40 blur-3xl" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-indigo-50 text-gray-400 ring-1 ring-gray-100">
                  <MapPin size={24} />
                </div>

                <h3 className="relative mt-4 font-black text-gray-900">
                  No saved address yet
                </h3>

                <p className="relative mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Your delivery address will automatically appear here after
                  you complete a checkout.
                </p>

                <Link
                  href="/buy"
                  className="relative mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg"
                >
                  Explore Phones
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-gray-950">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest purchases
              </p>
            </div>

            <Link
              href="/orders"
              className="group inline-flex items-center gap-1 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
            >
              View all
              <ChevronRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => {
                const firstItem = order.items?.[0];

                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/30"
                  >
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-indigo-50 p-2 ring-1 ring-gray-100">
                      {firstItem?.imageUrl ? (
                        <img
                          src={firstItem.imageUrl}
                          alt={firstItem.productName}
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ShoppingBag
                          size={24}
                          className="text-gray-300"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {firstItem?.brand || "PhoneBhai"}
                      </p>

                      <h3 className="mt-1 truncate text-sm font-black text-gray-950">
                        {firstItem?.productName || "Order"}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-gray-950">
                          ₹
                          {Number(order.totalAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </span>

                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-gray-300 transition duration-200 group-hover:translate-x-1 group-hover:text-indigo-600"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white p-8 text-center shadow-sm">
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-100/40 blur-3xl" />

              <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-indigo-50 text-gray-400 ring-1 ring-gray-100">
                <ShoppingBag size={24} />
              </div>

              <h3 className="relative mt-4 font-black text-gray-900">
                No recent purchases
              </h3>

              <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Once you place an order, your recent purchase will appear here.
              </p>

              <Link
                href="/buy"
                className="relative mt-5 inline-flex rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-indigo-600 hover:shadow-lg"
              >
                Explore Phones
              </Link>
            </div>
          )}
        </section>

        {/* ACCOUNT SETTINGS */}
        <section className="mt-8 overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gradient-to-r from-white to-indigo-50/40 p-6">
            <h2 className="font-black tracking-tight text-gray-950">
              Account Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            <a
              href="#personal-information"
              className="group flex w-full items-center justify-between p-6 text-left transition duration-200 hover:bg-indigo-50/40"
            >
              <div>
                <p className="text-sm font-bold text-gray-900 transition group-hover:text-indigo-600">
                  Personal Information
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Manage your name and contact details
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                <ChevronRight size={18} />
              </div>
            </a>

            <Link
              href="/edit-profile"
              className="group flex w-full items-center justify-between p-6 text-left transition duration-200 hover:bg-indigo-50/40"
            >
              <div>
                <p className="text-sm font-bold text-gray-900 transition group-hover:text-indigo-600">
                  Profile Settings
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Update your account information
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition group-hover:bg-indigo-100 group-hover:text-indigo-600">
                <ChevronRight size={18} />
              </div>
            </Link>

            <div className="flex w-full items-center justify-between p-6">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Order protection
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Secure checkout and order tracking
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                <ShieldCheck size={19} />
              </div>
            </div>
          </div>
        </section>

        {/* LOGOUT */}
        <div className="mt-8 flex justify-center pb-4">
          <button
            type="button"
            disabled={loggingOut}
            onClick={async () => {
              if (loggingOut) {
                return;
              }

              try {
                setLoggingOut(true);

                await logout();

                router.replace("/");
              } catch (error) {
                console.error("Logout error:", error);
              } finally {
                setLoggingOut(false);
              }
            }}
            className="group inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   ACCOUNT CARD
========================================================= */

function AccountCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/30"
    >
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-100/30 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 ring-1 ring-indigo-100 transition duration-300 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600">
          {icon}
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-300 transition duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600">
          <ChevronRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      <h3 className="relative mt-5 text-sm font-black text-gray-950 transition group-hover:text-indigo-600">
        {title}
      </h3>

      <p className="relative mt-1 text-xs text-gray-500">
        {description}
      </p>
    </Link>
  );
}